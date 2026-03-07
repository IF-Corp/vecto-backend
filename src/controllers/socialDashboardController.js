const SocialContact = require('../models/SocialContact');
const SocialCircle = require('../models/SocialCircle');
const SocialContactCircle = require('../models/SocialContactCircle');
const SocialContactReminder = require('../models/SocialContactReminder');
const SocialInteraction = require('../models/SocialInteraction');
const SocialEvent = require('../models/SocialEvent');
const SocialEventGuest = require('../models/SocialEventGuest');
const SocialBatteryLog = require('../models/SocialBatteryLog');
const SocialSettings = require('../models/SocialSettings');
const { Op } = require('sequelize');
const sequelize = require('../config/sequelize');

async function getSocialHealthScore(request, reply) {
    try {
        const { userId } = request.params;

        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        // Get all active contacts
        const contacts = await SocialContact.findAll({
            where: { user_id: userId, is_active: true },
        });
        const totalActiveContacts = contacts.length;
        const contactIds = contacts.map((c) => c.id);

        if (totalActiveContacts === 0) {
            return {
                success: true,
                data: {
                    score: 0,
                    status: 'Sem contatos',
                    emoji: '👤',
                    color: '#94A3B8',
                    healthyRelationships: 0,
                    needingAttention: 0,
                    totalTracked: 0,
                    contactsCoveredLast30d: 0,
                    interactionsLast30d: 0,
                    totalActiveContacts: 0,
                },
            };
        }

        // Factor 1: Contact Coverage (40%) — % of contacts interacted with in last 30 days
        const coveredContacts = await SocialInteraction.count({
            distinct: true,
            col: 'contact_id',
            where: {
                contact_id: { [Op.in]: contactIds },
                interaction_date: { [Op.gte]: thirtyDaysAgoStr },
            },
        });
        const coverageScore = (coveredContacts / totalActiveContacts) * 100;

        // Factor 2: Interaction Volume (30%) — interactions vs target
        const interactionCount = await SocialInteraction.count({
            where: {
                contact_id: { [Op.in]: contactIds },
                interaction_date: { [Op.gte]: thirtyDaysAgoStr },
            },
        });
        const target = Math.max(4, Math.ceil(totalActiveContacts * 0.3));
        const volumeScore = Math.min(100, (interactionCount / target) * 100);

        // Factor 3: Reminder Health (30%) — % of reminders on schedule
        const reminders = await SocialContactReminder.findAll({
            where: { contact_id: { [Op.in]: contactIds }, is_active: true },
        });

        let healthyRelationships = 0;
        let needingAttention = 0;

        for (const reminder of reminders) {
            let frequencyDays;
            switch (reminder.frequency_type) {
                case 'WEEKLY': frequencyDays = 7; break;
                case 'BIWEEKLY': frequencyDays = 14; break;
                case 'MONTHLY': frequencyDays = 30; break;
                case 'QUARTERLY': frequencyDays = 90; break;
                case 'YEARLY': frequencyDays = 365; break;
                default: frequencyDays = reminder.frequency_days || 30;
            }

            const lastInteraction = reminder.last_interaction_at ? new Date(reminder.last_interaction_at) : null;
            const daysSince = lastInteraction
                ? Math.floor((now - lastInteraction) / (1000 * 60 * 60 * 24))
                : 999;

            if (daysSince <= frequencyDays) {
                healthyRelationships++;
            } else {
                needingAttention++;
            }
        }

        // If no reminders, fall back to coverage score for this factor
        const reminderScore = reminders.length > 0
            ? (healthyRelationships / reminders.length) * 100
            : coverageScore;

        // Weighted final score (0-100)
        const score = Math.round(0.4 * coverageScore + 0.3 * volumeScore + 0.3 * reminderScore);

        let status, emoji, color;
        if (score >= 80) {
            status = 'Excelente';
            emoji = '💪';
            color = '#22C55E';
        } else if (score >= 50) {
            status = 'Moderado';
            emoji = '👍';
            color = '#EAB308';
        } else {
            status = 'Atenção';
            emoji = '⚠️';
            color = '#EF4444';
        }

        return {
            success: true,
            data: {
                score,
                status,
                emoji,
                color,
                healthyRelationships,
                needingAttention,
                totalTracked: reminders.length,
                contactsCoveredLast30d: coveredContacts,
                interactionsLast30d: interactionCount,
                totalActiveContacts,
            },
        };
    } catch (error) {
        console.error('Error getting social health score:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getDashboard(request, reply) {
    try {
        const { userId } = request.params;

        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Get settings
        const settings = await SocialSettings.findOne({ where: { user_id: userId } });

        // Get upcoming events
        const upcomingEvents = await SocialEvent.findAll({
            where: {
                user_id: userId,
                event_date: { [Op.between]: [today.toISOString().split('T')[0], nextWeek.toISOString().split('T')[0]] },
                status: { [Op.in]: ['PLANNING', 'CONFIRMED'] },
            },
            order: [['event_date', 'ASC']],
            limit: 5,
        });

        // Get upcoming birthdays
        const contacts = await SocialContact.findAll({
            where: { user_id: userId, is_active: true, birthday: { [Op.not]: null } },
        });

        const upcomingBirthdays = contacts
            .map((contact) => {
                const birthday = new Date(contact.birthday);
                const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

                if (thisYearBirthday < today) {
                    thisYearBirthday.setFullYear(today.getFullYear() + 1);
                }

                const daysUntil = Math.ceil((thisYearBirthday - today) / (1000 * 60 * 60 * 24));

                return { ...contact.toJSON(), daysUntilBirthday: daysUntil };
            })
            .filter((c) => c.daysUntilBirthday <= 7)
            .sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday)
            .slice(0, 5);

        // Get contacts needing attention
        const reminders = await SocialContactReminder.findAll({
            where: { is_active: true },
        });

        const contactsNeedingAttention = [];
        for (const reminder of reminders) {
            const contact = contacts.find((c) => c.id === reminder.contact_id);
            if (!contact) continue;

            let frequencyDays;
            switch (reminder.frequency_type) {
                case 'WEEKLY': frequencyDays = 7; break;
                case 'BIWEEKLY': frequencyDays = 14; break;
                case 'MONTHLY': frequencyDays = 30; break;
                case 'QUARTERLY': frequencyDays = 90; break;
                default: frequencyDays = reminder.frequency_days || 30;
            }

            const lastInteraction = reminder.last_interaction_at ? new Date(reminder.last_interaction_at) : null;
            const daysSince = lastInteraction
                ? Math.floor((today - lastInteraction) / (1000 * 60 * 60 * 24))
                : 999;

            if (daysSince > frequencyDays) {
                contactsNeedingAttention.push({
                    ...contact.toJSON(),
                    daysSince,
                    daysOverdue: daysSince - frequencyDays,
                });
            }
        }

        contactsNeedingAttention.sort((a, b) => b.daysOverdue - a.daysOverdue);

        // Get stats
        const totalContacts = await SocialContact.count({
            where: { user_id: userId, is_active: true },
        });

        const totalEvents = await SocialEvent.count({
            where: {
                user_id: userId,
                event_date: { [Op.gte]: today.toISOString().split('T')[0] },
                status: { [Op.in]: ['PLANNING', 'CONFIRMED'] },
            },
        });

        // Get social battery if enabled
        let socialBattery = null;
        if (settings?.enable_social_battery) {
            const todayLog = await SocialBatteryLog.findOne({
                where: { user_id: userId, date: today.toISOString().split('T')[0] },
            });
            socialBattery = todayLog?.battery_level || 50;
        }

        return {
            success: true,
            data: {
                quickStats: {
                    totalContacts,
                    upcomingEvents: totalEvents,
                    birthdaysThisWeek: upcomingBirthdays.length,
                    needingAttention: contactsNeedingAttention.length,
                },
                upcomingEvents,
                upcomingBirthdays,
                contactsNeedingAttention: contactsNeedingAttention.slice(0, 5),
                socialBattery,
            },
        };
    } catch (error) {
        console.error('Error getting social dashboard:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateSocialBattery(request, reply) {
    try {
        const { userId } = request.params;
        const { batteryLevel, socialEventsCount, rechargeTimeHours, notes } = request.body;

        const today = new Date().toISOString().split('T')[0];

        let log = await SocialBatteryLog.findOne({
            where: { user_id: userId, date: today },
        });

        if (log) {
            await log.update({
                battery_level: batteryLevel,
                social_events_count: socialEventsCount,
                recharge_time_hours: rechargeTimeHours,
                notes,
            });
        } else {
            log = await SocialBatteryLog.create({
                user_id: userId,
                date: today,
                battery_level: batteryLevel,
                social_events_count: socialEventsCount,
                recharge_time_hours: rechargeTimeHours,
                notes,
            });
        }

        return { success: true, data: log };
    } catch (error) {
        console.error('Error updating social battery:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getBatteryHistory(request, reply) {
    try {
        const { userId } = request.params;
        const { days = 30 } = request.query;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        const logs = await SocialBatteryLog.findAll({
            where: {
                user_id: userId,
                date: { [Op.gte]: startDate.toISOString().split('T')[0] },
            },
            order: [['date', 'ASC']],
        });

        return { success: true, data: logs };
    } catch (error) {
        console.error('Error getting battery history:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

module.exports = {
    getSocialHealthScore,
    getDashboard,
    updateSocialBattery,
    getBatteryHistory,
};

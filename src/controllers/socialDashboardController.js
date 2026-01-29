const SocialContact = require('../models/SocialContact');
const SocialCircle = require('../models/SocialCircle');
const SocialContactCircle = require('../models/SocialContactCircle');
const SocialContactReminder = require('../models/SocialContactReminder');
const SocialEvent = require('../models/SocialEvent');
const SocialEventGuest = require('../models/SocialEventGuest');
const SocialBatteryLog = require('../models/SocialBatteryLog');
const SocialSettings = require('../models/SocialSettings');
const { Op } = require('sequelize');

async function getSocialHealthScore(request, reply) {
    try {
        const { userId } = request.params;

        // Get all contacts with reminders
        const contacts = await SocialContact.findAll({
            where: { user_id: userId, is_active: true },
        });

        const reminders = await SocialContactReminder.findAll({
            where: { contact_id: contacts.map((c) => c.id), is_active: true },
        });

        const now = new Date();
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

        const total = reminders.length || 1;
        const score = Math.round((healthyRelationships / total) * 10 * 10) / 10;

        let status, emoji, color;
        if (score >= 8) {
            status = 'Excelente';
            emoji = '💪';
            color = '#22C55E';
        } else if (score >= 5) {
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

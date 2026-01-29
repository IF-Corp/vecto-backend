const SocialInteraction = require('../models/SocialInteraction');
const SocialContact = require('../models/SocialContact');
const SocialContactReminder = require('../models/SocialContactReminder');
const { Op } = require('sequelize');

async function getInteractions(request, reply) {
    try {
        const { contactId } = request.params;
        const { limit = 20 } = request.query;

        const interactions = await SocialInteraction.findAll({
            where: { contact_id: contactId },
            order: [['interaction_date', 'DESC']],
            limit: parseInt(limit),
        });

        return { success: true, data: interactions };
    } catch (error) {
        console.error('Error getting interactions:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function createInteraction(request, reply) {
    try {
        const { contactId } = request.params;
        const data = request.body;

        const contact = await SocialContact.findByPk(contactId);

        if (!contact) {
            return reply.status(404).send({ success: false, error: 'Contact not found' });
        }

        const interaction = await SocialInteraction.create({
            contact_id: contactId,
            ...data,
        });

        // Update reminder's last interaction
        const reminder = await SocialContactReminder.findOne({
            where: { contact_id: contactId },
        });

        if (reminder) {
            await reminder.update({
                last_interaction_at: new Date(data.interaction_date),
                last_interaction_type: data.interaction_type,
            });
        }

        return reply.status(201).send({ success: true, data: interaction });
    } catch (error) {
        console.error('Error creating interaction:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function deleteInteraction(request, reply) {
    try {
        const { id } = request.params;

        const interaction = await SocialInteraction.findByPk(id);

        if (!interaction) {
            return reply.status(404).send({ success: false, error: 'Interaction not found' });
        }

        await interaction.destroy();

        return { success: true, data: { deleted: true } };
    } catch (error) {
        console.error('Error deleting interaction:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getContactsNeedingAttention(request, reply) {
    try {
        const { userId } = request.params;

        const reminders = await SocialContactReminder.findAll({
            where: { is_active: true },
        });

        const contacts = await SocialContact.findAll({
            where: {
                user_id: userId,
                is_active: true,
                id: reminders.map((r) => r.contact_id),
            },
        });

        const now = new Date();
        const contactsWithStatus = contacts
            .map((contact) => {
                const reminder = reminders.find((r) => r.contact_id === contact.id);
                if (!reminder) return null;

                const lastInteraction = reminder.last_interaction_at
                    ? new Date(reminder.last_interaction_at)
                    : null;

                let frequencyDays;
                switch (reminder.frequency_type) {
                    case 'WEEKLY': frequencyDays = 7; break;
                    case 'BIWEEKLY': frequencyDays = 14; break;
                    case 'MONTHLY': frequencyDays = 30; break;
                    case 'QUARTERLY': frequencyDays = 90; break;
                    case 'YEARLY': frequencyDays = 365; break;
                    case 'CUSTOM': frequencyDays = reminder.frequency_days || 30; break;
                    default: frequencyDays = 30;
                }

                const daysSinceContact = lastInteraction
                    ? Math.floor((now - lastInteraction) / (1000 * 60 * 60 * 24))
                    : 999;

                const isOverdue = daysSinceContact > frequencyDays;
                const daysOverdue = isOverdue ? daysSinceContact - frequencyDays : 0;

                return {
                    ...contact.toJSON(),
                    reminder,
                    daysSinceContact,
                    frequencyDays,
                    isOverdue,
                    daysOverdue,
                };
            })
            .filter((c) => c !== null)
            .sort((a, b) => {
                if (a.isOverdue && !b.isOverdue) return -1;
                if (!a.isOverdue && b.isOverdue) return 1;
                return b.daysOverdue - a.daysOverdue;
            });

        const needingAttention = contactsWithStatus.filter((c) => c.isOverdue);
        const upToDate = contactsWithStatus.filter((c) => !c.isOverdue);

        return {
            success: true,
            data: { needingAttention, upToDate },
        };
    } catch (error) {
        console.error('Error getting contacts needing attention:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

module.exports = {
    getInteractions,
    createInteraction,
    deleteInteraction,
    getContactsNeedingAttention,
};

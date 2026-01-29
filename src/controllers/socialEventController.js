const SocialEvent = require('../models/SocialEvent');
const SocialEventGuest = require('../models/SocialEventGuest');
const SocialEventChecklist = require('../models/SocialEventChecklist');
const SocialContact = require('../models/SocialContact');
const SocialInteraction = require('../models/SocialInteraction');
const { Op } = require('sequelize');

async function getEvents(request, reply) {
    try {
        const { userId } = request.params;
        const { status, upcoming } = request.query;

        const where = { user_id: userId };

        if (status) {
            where.status = status;
        }

        if (upcoming === 'true') {
            where.event_date = { [Op.gte]: new Date().toISOString().split('T')[0] };
            where.status = { [Op.in]: ['PLANNING', 'CONFIRMED'] };
        }

        const events = await SocialEvent.findAll({
            where,
            order: [['event_date', 'ASC']],
        });

        // Get guest counts for each event
        const eventsWithCounts = await Promise.all(
            events.map(async (event) => {
                const guests = await SocialEventGuest.findAll({
                    where: { event_id: event.id },
                });
                const guestCounts = {
                    total: guests.length,
                    confirmed: guests.filter((g) => g.status === 'CONFIRMED').length,
                    maybe: guests.filter((g) => g.status === 'MAYBE').length,
                    declined: guests.filter((g) => g.status === 'DECLINED').length,
                };
                return { ...event.toJSON(), guestCounts };
            })
        );

        return { success: true, data: eventsWithCounts };
    } catch (error) {
        console.error('Error getting events:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getEvent(request, reply) {
    try {
        const { id } = request.params;

        const event = await SocialEvent.findByPk(id);

        if (!event) {
            return reply.status(404).send({ success: false, error: 'Event not found' });
        }

        const [guests, checklist] = await Promise.all([
            SocialEventGuest.findAll({ where: { event_id: id } }).then(async (guestRelations) => {
                const contactIds = guestRelations.map((g) => g.contact_id);
                const contacts = await SocialContact.findAll({ where: { id: contactIds } });
                return guestRelations.map((g) => ({
                    ...g.toJSON(),
                    contact: contacts.find((c) => c.id === g.contact_id),
                }));
            }),
            SocialEventChecklist.findAll({
                where: { event_id: id },
                order: [['sort_order', 'ASC']],
            }),
        ]);

        return {
            success: true,
            data: { ...event.toJSON(), guests, checklist },
        };
    } catch (error) {
        console.error('Error getting event:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function createEvent(request, reply) {
    try {
        const { userId } = request.params;
        const data = request.body;

        const event = await SocialEvent.create({
            user_id: userId,
            ...data,
        });

        return reply.status(201).send({ success: true, data: event });
    } catch (error) {
        console.error('Error creating event:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateEvent(request, reply) {
    try {
        const { id } = request.params;
        const data = request.body;

        const event = await SocialEvent.findByPk(id);

        if (!event) {
            return reply.status(404).send({ success: false, error: 'Event not found' });
        }

        await event.update(data);

        return { success: true, data: event };
    } catch (error) {
        console.error('Error updating event:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function deleteEvent(request, reply) {
    try {
        const { id } = request.params;

        const event = await SocialEvent.findByPk(id);

        if (!event) {
            return reply.status(404).send({ success: false, error: 'Event not found' });
        }

        await SocialEventGuest.destroy({ where: { event_id: id } });
        await SocialEventChecklist.destroy({ where: { event_id: id } });
        await event.destroy();

        return { success: true, data: { deleted: true } };
    } catch (error) {
        console.error('Error deleting event:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function addGuest(request, reply) {
    try {
        const { eventId } = request.params;
        const { contactId, status = 'INVITED' } = request.body;

        const existing = await SocialEventGuest.findOne({
            where: { event_id: eventId, contact_id: contactId },
        });

        if (existing) {
            return reply.status(400).send({ success: false, error: 'Guest already added' });
        }

        const guest = await SocialEventGuest.create({
            event_id: eventId,
            contact_id: contactId,
            status,
        });

        return reply.status(201).send({ success: true, data: guest });
    } catch (error) {
        console.error('Error adding guest:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateGuestStatus(request, reply) {
    try {
        const { guestId } = request.params;
        const { status, notes } = request.body;

        const guest = await SocialEventGuest.findByPk(guestId);

        if (!guest) {
            return reply.status(404).send({ success: false, error: 'Guest not found' });
        }

        await guest.update({ status, notes });

        return { success: true, data: guest };
    } catch (error) {
        console.error('Error updating guest status:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function removeGuest(request, reply) {
    try {
        const { guestId } = request.params;

        const guest = await SocialEventGuest.findByPk(guestId);

        if (!guest) {
            return reply.status(404).send({ success: false, error: 'Guest not found' });
        }

        await guest.destroy();

        return { success: true, data: { deleted: true } };
    } catch (error) {
        console.error('Error removing guest:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function addChecklistItem(request, reply) {
    try {
        const { eventId } = request.params;
        const { item } = request.body;

        const maxOrder = await SocialEventChecklist.max('sort_order', {
            where: { event_id: eventId },
        });

        const checklistItem = await SocialEventChecklist.create({
            event_id: eventId,
            item,
            sort_order: (maxOrder || 0) + 1,
        });

        return reply.status(201).send({ success: true, data: checklistItem });
    } catch (error) {
        console.error('Error adding checklist item:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function toggleChecklistItem(request, reply) {
    try {
        const { itemId } = request.params;

        const item = await SocialEventChecklist.findByPk(itemId);

        if (!item) {
            return reply.status(404).send({ success: false, error: 'Item not found' });
        }

        await item.update({ is_completed: !item.is_completed });

        return { success: true, data: item };
    } catch (error) {
        console.error('Error toggling checklist item:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function completeEvent(request, reply) {
    try {
        const { id } = request.params;
        const { actualCost } = request.body;

        const event = await SocialEvent.findByPk(id);

        if (!event) {
            return reply.status(404).send({ success: false, error: 'Event not found' });
        }

        await event.update({
            status: 'COMPLETED',
            actual_cost: actualCost || event.actual_cost,
        });

        // Create interactions for confirmed guests
        const confirmedGuests = await SocialEventGuest.findAll({
            where: { event_id: id, status: 'CONFIRMED' },
        });

        for (const guest of confirmedGuests) {
            await SocialInteraction.create({
                contact_id: guest.contact_id,
                event_id: id,
                interaction_date: event.event_date,
                interaction_type: 'IN_PERSON',
                description: `Participou do evento: ${event.name}`,
            });
        }

        return { success: true, data: event };
    } catch (error) {
        console.error('Error completing event:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

module.exports = {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    addGuest,
    updateGuestStatus,
    removeGuest,
    addChecklistItem,
    toggleChecklistItem,
    completeEvent,
};

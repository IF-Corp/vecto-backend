const SocialGift = require('../models/SocialGift');
const SocialGiftIdea = require('../models/SocialGiftIdea');
const SocialContact = require('../models/SocialContact');
const { Op } = require('sequelize');

async function getGifts(request, reply) {
    try {
        const { userId } = request.params;
        const { contactId, type, year } = request.query;

        const where = { user_id: userId };

        if (contactId) {
            where.contact_id = contactId;
        }

        if (type) {
            where.gift_type = type;
        }

        if (year) {
            const startDate = `${year}-01-01`;
            const endDate = `${year}-12-31`;
            where.date = { [Op.between]: [startDate, endDate] };
        }

        const gifts = await SocialGift.findAll({
            where,
            order: [['date', 'DESC']],
        });

        // Get contact names
        const contactIds = [...new Set(gifts.map((g) => g.contact_id))];
        const contacts = await SocialContact.findAll({
            where: { id: contactIds },
            attributes: ['id', 'name', 'nickname'],
        });

        const giftsWithContacts = gifts.map((gift) => ({
            ...gift.toJSON(),
            contact: contacts.find((c) => c.id === gift.contact_id),
        }));

        return { success: true, data: giftsWithContacts };
    } catch (error) {
        console.error('Error getting gifts:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function createGift(request, reply) {
    try {
        const { userId } = request.params;
        const data = request.body;

        const gift = await SocialGift.create({
            user_id: userId,
            ...data,
        });

        return reply.status(201).send({ success: true, data: gift });
    } catch (error) {
        console.error('Error creating gift:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function deleteGift(request, reply) {
    try {
        const { id } = request.params;

        const gift = await SocialGift.findByPk(id);

        if (!gift) {
            return reply.status(404).send({ success: false, error: 'Gift not found' });
        }

        await gift.destroy();

        return { success: true, data: { deleted: true } };
    } catch (error) {
        console.error('Error deleting gift:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getGiftIdeas(request, reply) {
    try {
        const { contactId } = request.params;

        const ideas = await SocialGiftIdea.findAll({
            where: { contact_id: contactId, is_purchased: false },
            order: [
                ['priority', 'ASC'],
                ['created_at', 'DESC'],
            ],
        });

        return { success: true, data: ideas };
    } catch (error) {
        console.error('Error getting gift ideas:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function createGiftIdea(request, reply) {
    try {
        const { contactId } = request.params;
        const data = request.body;

        const idea = await SocialGiftIdea.create({
            contact_id: contactId,
            ...data,
        });

        return reply.status(201).send({ success: true, data: idea });
    } catch (error) {
        console.error('Error creating gift idea:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateGiftIdea(request, reply) {
    try {
        const { ideaId } = request.params;
        const data = request.body;

        const idea = await SocialGiftIdea.findByPk(ideaId);

        if (!idea) {
            return reply.status(404).send({ success: false, error: 'Gift idea not found' });
        }

        await idea.update(data);

        return { success: true, data: idea };
    } catch (error) {
        console.error('Error updating gift idea:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function markIdeaAsPurchased(request, reply) {
    try {
        const { ideaId } = request.params;
        const { createGift, giftData } = request.body;

        const idea = await SocialGiftIdea.findByPk(ideaId);

        if (!idea) {
            return reply.status(404).send({ success: false, error: 'Gift idea not found' });
        }

        await idea.update({ is_purchased: true });

        // Optionally create a gift record
        if (createGift && giftData) {
            const contact = await SocialContact.findByPk(idea.contact_id);
            await SocialGift.create({
                user_id: contact.user_id,
                contact_id: idea.contact_id,
                gift_type: 'GIVEN',
                description: idea.description,
                value: idea.estimated_price,
                ...giftData,
            });
        }

        return { success: true, data: idea };
    } catch (error) {
        console.error('Error marking idea as purchased:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function deleteGiftIdea(request, reply) {
    try {
        const { ideaId } = request.params;

        const idea = await SocialGiftIdea.findByPk(ideaId);

        if (!idea) {
            return reply.status(404).send({ success: false, error: 'Gift idea not found' });
        }

        await idea.destroy();

        return { success: true, data: { deleted: true } };
    } catch (error) {
        console.error('Error deleting gift idea:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

module.exports = {
    getGifts,
    createGift,
    deleteGift,
    getGiftIdeas,
    createGiftIdea,
    updateGiftIdea,
    markIdeaAsPurchased,
    deleteGiftIdea,
};

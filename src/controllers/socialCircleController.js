const SocialCircle = require('../models/SocialCircle');
const SocialContactCircle = require('../models/SocialContactCircle');
const { Op } = require('sequelize');

async function getCircles(request, reply) {
    try {
        const { userId } = request.params;

        const circles = await SocialCircle.findAll({
            where: { user_id: userId },
            order: [['sort_order', 'ASC'], ['name', 'ASC']],
        });

        // Get contact counts for each circle
        const circlesWithCounts = await Promise.all(
            circles.map(async (circle) => {
                const count = await SocialContactCircle.count({
                    where: { circle_id: circle.id },
                });
                return { ...circle.toJSON(), contact_count: count };
            })
        );

        return { success: true, data: circlesWithCounts };
    } catch (error) {
        console.error('Error getting circles:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function getCircle(request, reply) {
    try {
        const { id } = request.params;

        const circle = await SocialCircle.findByPk(id);

        if (!circle) {
            return reply.status(404).send({ success: false, error: 'Circle not found' });
        }

        const contactCount = await SocialContactCircle.count({
            where: { circle_id: id },
        });

        return { success: true, data: { ...circle.toJSON(), contact_count: contactCount } };
    } catch (error) {
        console.error('Error getting circle:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function createCircle(request, reply) {
    try {
        const { userId } = request.params;
        const data = request.body;

        const maxOrder = await SocialCircle.max('sort_order', {
            where: { user_id: userId },
        });

        const circle = await SocialCircle.create({
            user_id: userId,
            ...data,
            sort_order: (maxOrder || 0) + 1,
            is_default: false,
        });

        return reply.status(201).send({ success: true, data: circle });
    } catch (error) {
        console.error('Error creating circle:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateCircle(request, reply) {
    try {
        const { id } = request.params;
        const data = request.body;

        const circle = await SocialCircle.findByPk(id);

        if (!circle) {
            return reply.status(404).send({ success: false, error: 'Circle not found' });
        }

        await circle.update(data);

        return { success: true, data: circle };
    } catch (error) {
        console.error('Error updating circle:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function deleteCircle(request, reply) {
    try {
        const { id } = request.params;

        const circle = await SocialCircle.findByPk(id);

        if (!circle) {
            return reply.status(404).send({ success: false, error: 'Circle not found' });
        }

        if (circle.is_default) {
            return reply.status(400).send({ success: false, error: 'Cannot delete default circle' });
        }

        await SocialContactCircle.destroy({ where: { circle_id: id } });
        await circle.destroy();

        return { success: true, data: { deleted: true } };
    } catch (error) {
        console.error('Error deleting circle:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function reorderCircles(request, reply) {
    try {
        const { userId } = request.params;
        const { circleIds } = request.body;

        for (let i = 0; i < circleIds.length; i++) {
            await SocialCircle.update(
                { sort_order: i + 1 },
                { where: { id: circleIds[i], user_id: userId } }
            );
        }

        return { success: true, data: { reordered: true } };
    } catch (error) {
        console.error('Error reordering circles:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

module.exports = {
    getCircles,
    getCircle,
    createCircle,
    updateCircle,
    deleteCircle,
    reorderCircles,
};

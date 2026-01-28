const { HomeMember, HomeSpace } = require('../models');

// ==================== MEMBERS ====================

const getMembers = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const members = await HomeMember.findAll({
            where: { space_id: spaceId },
            order: [['name', 'ASC']],
        });
        return { success: true, data: members };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getMember = async (request, reply) => {
    try {
        const { id } = request.params;
        const member = await HomeMember.findByPk(id);
        if (!member) {
            reply.status(404);
            return { success: false, error: 'Member not found' };
        }
        return { success: true, data: member };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createMember = async (request, reply) => {
    try {
        const { spaceId } = request.params;

        // Verify space exists
        const space = await HomeSpace.findByPk(spaceId);
        if (!space) {
            reply.status(404);
            return { success: false, error: 'Space not found' };
        }

        const member = await HomeMember.create({
            ...request.body,
            space_id: spaceId,
        });

        reply.status(201);
        return { success: true, data: member, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMember = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HomeMember.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Member not found' };
        }
        const member = await HomeMember.findByPk(id);
        return { success: true, data: member };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMember = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HomeMember.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Member not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getMembersByUser = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Get all spaces for the user first
        const spaces = await HomeSpace.findAll({
            where: { user_id: userId },
            attributes: ['id'],
        });

        const spaceIds = spaces.map((s) => s.id);

        const members = await HomeMember.findAll({
            where: { space_id: spaceIds },
            include: [{ model: HomeSpace, as: 'space', attributes: ['id', 'name'] }],
            order: [['name', 'ASC']],
        });

        return { success: true, data: members };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
    getMembersByUser,
};

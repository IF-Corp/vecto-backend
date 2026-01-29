const { HomeMaintenance, HomeWarranty, HomeSpace } = require('../models');
const { Op } = require('sequelize');
const { addDays, addWeeks, addMonths, addYears } = require('date-fns');

// ==================== MAINTENANCES ====================

const getMaintenances = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const maintenances = await HomeMaintenance.findAll({
            where: { space_id: spaceId },
            order: [['next_due_at', 'ASC']],
        });
        return { success: true, data: maintenances };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getMaintenance = async (request, reply) => {
    try {
        const { id } = request.params;
        const maintenance = await HomeMaintenance.findByPk(id);
        if (!maintenance) {
            reply.status(404);
            return { success: false, error: 'Maintenance not found' };
        }
        return { success: true, data: maintenance };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createMaintenance = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const data = {
            ...request.body,
            space_id: spaceId,
        };

        // Calculate next_due_at if not provided
        if (!data.next_due_at && data.frequency_type) {
            data.next_due_at = calculateNextDue(new Date(), data.frequency_type, data.frequency_value);
        }

        const maintenance = await HomeMaintenance.create(data);
        reply.status(201);
        return { success: true, data: maintenance, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMaintenance = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HomeMaintenance.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Maintenance not found' };
        }
        const maintenance = await HomeMaintenance.findByPk(id);
        return { success: true, data: maintenance };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMaintenance = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HomeMaintenance.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Maintenance not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const completeMaintenance = async (request, reply) => {
    try {
        const { id } = request.params;
        const { cost, notes } = request.body;

        const maintenance = await HomeMaintenance.findByPk(id);
        if (!maintenance) {
            reply.status(404);
            return { success: false, error: 'Maintenance not found' };
        }

        const now = new Date();
        const nextDue = calculateNextDue(now, maintenance.frequency_type, maintenance.frequency_value);

        await maintenance.update({
            last_done_at: now,
            next_due_at: nextDue,
        });

        return { success: true, data: maintenance };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getUpcomingMaintenances = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const { days = 30 } = request.query;

        const endDate = addDays(new Date(), parseInt(days));
        const maintenances = await HomeMaintenance.findAll({
            where: {
                space_id: spaceId,
                is_active: true,
                next_due_at: {
                    [Op.lte]: endDate,
                },
            },
            order: [['next_due_at', 'ASC']],
        });

        return { success: true, data: maintenances };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== WARRANTIES ====================

const getWarranties = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const warranties = await HomeWarranty.findAll({
            where: { space_id: spaceId },
            order: [['warranty_until', 'ASC']],
        });
        return { success: true, data: warranties };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getWarranty = async (request, reply) => {
    try {
        const { id } = request.params;
        const warranty = await HomeWarranty.findByPk(id);
        if (!warranty) {
            reply.status(404);
            return { success: false, error: 'Warranty not found' };
        }
        return { success: true, data: warranty };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createWarranty = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const warranty = await HomeWarranty.create({
            ...request.body,
            space_id: spaceId,
        });
        reply.status(201);
        return { success: true, data: warranty, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateWarranty = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HomeWarranty.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Warranty not found' };
        }
        const warranty = await HomeWarranty.findByPk(id);
        return { success: true, data: warranty };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteWarranty = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HomeWarranty.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Warranty not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getExpiringWarranties = async (request, reply) => {
    try {
        const { spaceId } = request.params;
        const { days = 90 } = request.query;

        const endDate = addDays(new Date(), parseInt(days));
        const warranties = await HomeWarranty.findAll({
            where: {
                space_id: spaceId,
                warranty_until: {
                    [Op.between]: [new Date(), endDate],
                },
            },
            order: [['warranty_until', 'ASC']],
        });

        return { success: true, data: warranties };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== HELPERS ====================

function calculateNextDue(fromDate, frequencyType, frequencyValue) {
    switch (frequencyType) {
        case 'DAILY':
            return addDays(fromDate, 1);
        case 'WEEKLY':
            return addWeeks(fromDate, 1);
        case 'BIWEEKLY':
            return addWeeks(fromDate, 2);
        case 'MONTHLY':
            return addMonths(fromDate, 1);
        case 'QUARTERLY':
            return addMonths(fromDate, 3);
        case 'YEARLY':
            return addYears(fromDate, 1);
        case 'CUSTOM':
            return addDays(fromDate, frequencyValue || 30);
        default:
            return addMonths(fromDate, 1);
    }
}

module.exports = {
    getMaintenances,
    getMaintenance,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    completeMaintenance,
    getUpcomingMaintenances,
    getWarranties,
    getWarranty,
    createWarranty,
    updateWarranty,
    deleteWarranty,
    getExpiringWarranties,
};

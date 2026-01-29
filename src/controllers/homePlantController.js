const HomePlant = require('../models/HomePlant');
const HomePlantCareType = require('../models/HomePlantCareType');
const HomePlantCareLog = require('../models/HomePlantCareLog');
const { Op } = require('sequelize');

// Get all plants for a space
const getPlants = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        const plants = await HomePlant.findAll({
            where: { space_id: spaceId, is_active: true },
            order: [['name', 'ASC']],
        });

        // Get care types for each plant
        const plantsWithCare = await Promise.all(
            plants.map(async (plant) => {
                const careTypes = await HomePlantCareType.findAll({
                    where: { plant_id: plant.id, is_active: true },
                });
                return {
                    ...plant.toJSON(),
                    careTypes,
                };
            })
        );

        return reply.send({ success: true, data: plantsWithCare });
    } catch (error) {
        console.error('Error getting plants:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get a single plant
const getPlant = async (request, reply) => {
    try {
        const { userId, spaceId, plantId } = request.params;

        const plant = await HomePlant.findOne({
            where: { id: plantId, space_id: spaceId },
        });

        if (!plant) {
            return reply.status(404).send({ success: false, error: 'Plant not found' });
        }

        const careTypes = await HomePlantCareType.findAll({
            where: { plant_id: plant.id, is_active: true },
        });

        return reply.send({
            success: true,
            data: { ...plant.toJSON(), careTypes },
        });
    } catch (error) {
        console.error('Error getting plant:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Create a new plant
const createPlant = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { careTypes, ...plantData } = request.body;

        const plant = await HomePlant.create({
            ...plantData,
            space_id: spaceId,
        });

        // Create default water care type if not provided
        if (!careTypes || careTypes.length === 0) {
            await HomePlantCareType.create({
                plant_id: plant.id,
                care_type: 'WATER',
                frequency_days: 7,
                next_due_at: new Date(),
            });
        } else {
            await Promise.all(
                careTypes.map((care) =>
                    HomePlantCareType.create({
                        ...care,
                        plant_id: plant.id,
                        next_due_at: new Date(),
                    })
                )
            );
        }

        return reply.status(201).send({ success: true, data: plant });
    } catch (error) {
        console.error('Error creating plant:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update a plant
const updatePlant = async (request, reply) => {
    try {
        const { userId, spaceId, plantId } = request.params;
        const data = request.body;

        const plant = await HomePlant.findOne({
            where: { id: plantId, space_id: spaceId },
        });

        if (!plant) {
            return reply.status(404).send({ success: false, error: 'Plant not found' });
        }

        await plant.update(data);

        return reply.send({ success: true, data: plant });
    } catch (error) {
        console.error('Error updating plant:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Delete a plant
const deletePlant = async (request, reply) => {
    try {
        const { userId, spaceId, plantId } = request.params;

        const plant = await HomePlant.findOne({
            where: { id: plantId, space_id: spaceId },
        });

        if (!plant) {
            return reply.status(404).send({ success: false, error: 'Plant not found' });
        }

        await plant.update({ is_active: false });

        return reply.send({ success: true, message: 'Plant deleted successfully' });
    } catch (error) {
        console.error('Error deleting plant:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Complete plant care
const completePlantCare = async (request, reply) => {
    try {
        const { userId, spaceId, plantId, careType } = request.params;
        const { notes, doneByMemberId } = request.body;

        const careTypeRecord = await HomePlantCareType.findOne({
            where: { plant_id: plantId, care_type: careType, is_active: true },
        });

        if (!careTypeRecord) {
            return reply.status(404).send({ success: false, error: 'Care type not found' });
        }

        const now = new Date();

        // Create log
        await HomePlantCareLog.create({
            care_type_id: careTypeRecord.id,
            done_at: now,
            done_by_member_id: doneByMemberId,
            notes,
        });

        // Update care type
        const nextDueAt = new Date(now);
        nextDueAt.setDate(nextDueAt.getDate() + careTypeRecord.frequency_days);

        await careTypeRecord.update({
            last_done_at: now,
            next_due_at: nextDueAt,
        });

        return reply.send({ success: true, data: careTypeRecord });
    } catch (error) {
        console.error('Error completing plant care:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get plants needing care
const getPlantsNeedingCare = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        const plants = await HomePlant.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const now = new Date();
        const plantsNeedingCare = [];

        for (const plant of plants) {
            const careTypes = await HomePlantCareType.findAll({
                where: {
                    plant_id: plant.id,
                    is_active: true,
                    next_due_at: { [Op.lte]: now },
                },
            });

            if (careTypes.length > 0) {
                plantsNeedingCare.push({
                    ...plant.toJSON(),
                    careTypesNeeded: careTypes,
                });
            }
        }

        return reply.send({ success: true, data: plantsNeedingCare });
    } catch (error) {
        console.error('Error getting plants needing care:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get plant care schedule
const getPlantCareSchedule = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { days = 7 } = request.query;

        const plants = await HomePlant.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + parseInt(days));

        const schedule = [];

        for (const plant of plants) {
            const careTypes = await HomePlantCareType.findAll({
                where: {
                    plant_id: plant.id,
                    is_active: true,
                    next_due_at: { [Op.between]: [now, futureDate] },
                },
                order: [['next_due_at', 'ASC']],
            });

            for (const care of careTypes) {
                schedule.push({
                    plant,
                    careType: care,
                    dueDate: care.next_due_at,
                });
            }
        }

        schedule.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        return reply.send({ success: true, data: schedule });
    } catch (error) {
        console.error('Error getting plant care schedule:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    getPlants,
    getPlant,
    createPlant,
    updatePlant,
    deletePlant,
    completePlantCare,
    getPlantsNeedingCare,
    getPlantCareSchedule,
};

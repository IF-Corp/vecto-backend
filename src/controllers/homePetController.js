const HomePet = require('../models/HomePet');
const HomePetCareType = require('../models/HomePetCareType');
const HomePetCareLog = require('../models/HomePetCareLog');
const { Op } = require('sequelize');

// Get all pets for a space
const getPets = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        const pets = await HomePet.findAll({
            where: { space_id: spaceId, is_active: true },
            order: [['name', 'ASC']],
        });

        // Get care types for each pet
        const petsWithCare = await Promise.all(
            pets.map(async (pet) => {
                const careTypes = await HomePetCareType.findAll({
                    where: { pet_id: pet.id, is_active: true },
                });
                return {
                    ...pet.toJSON(),
                    careTypes,
                };
            })
        );

        return reply.send({ success: true, data: petsWithCare });
    } catch (error) {
        console.error('Error getting pets:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get a single pet
const getPet = async (request, reply) => {
    try {
        const { userId, spaceId, petId } = request.params;

        const pet = await HomePet.findOne({
            where: { id: petId, space_id: spaceId },
        });

        if (!pet) {
            return reply.status(404).send({ success: false, error: 'Pet not found' });
        }

        const careTypes = await HomePetCareType.findAll({
            where: { pet_id: pet.id, is_active: true },
        });

        // Get care history
        const careHistory = await HomePetCareLog.findAll({
            where: {
                care_type_id: { [Op.in]: careTypes.map((c) => c.id) },
            },
            order: [['done_at', 'DESC']],
            limit: 20,
        });

        return reply.send({
            success: true,
            data: { ...pet.toJSON(), careTypes, careHistory },
        });
    } catch (error) {
        console.error('Error getting pet:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Create a new pet
const createPet = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { careTypes, ...petData } = request.body;

        const pet = await HomePet.create({
            ...petData,
            space_id: spaceId,
        });

        // Create care types if provided
        if (careTypes && careTypes.length > 0) {
            await Promise.all(
                careTypes.map((care) =>
                    HomePetCareType.create({
                        ...care,
                        pet_id: pet.id,
                    })
                )
            );
        }

        return reply.status(201).send({ success: true, data: pet });
    } catch (error) {
        console.error('Error creating pet:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update a pet
const updatePet = async (request, reply) => {
    try {
        const { userId, spaceId, petId } = request.params;
        const data = request.body;

        const pet = await HomePet.findOne({
            where: { id: petId, space_id: spaceId },
        });

        if (!pet) {
            return reply.status(404).send({ success: false, error: 'Pet not found' });
        }

        await pet.update(data);

        return reply.send({ success: true, data: pet });
    } catch (error) {
        console.error('Error updating pet:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Delete a pet
const deletePet = async (request, reply) => {
    try {
        const { userId, spaceId, petId } = request.params;

        const pet = await HomePet.findOne({
            where: { id: petId, space_id: spaceId },
        });

        if (!pet) {
            return reply.status(404).send({ success: false, error: 'Pet not found' });
        }

        await pet.update({ is_active: false });

        return reply.send({ success: true, message: 'Pet deleted successfully' });
    } catch (error) {
        console.error('Error deleting pet:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Add care type to pet
const addPetCareType = async (request, reply) => {
    try {
        const { userId, spaceId, petId } = request.params;
        const data = request.body;

        const careType = await HomePetCareType.create({
            ...data,
            pet_id: petId,
        });

        return reply.status(201).send({ success: true, data: careType });
    } catch (error) {
        console.error('Error adding pet care type:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Complete pet care
const completePetCare = async (request, reply) => {
    try {
        const { userId, spaceId, petId, careTypeId } = request.params;
        const { provider, cost, notes } = request.body;

        const careType = await HomePetCareType.findOne({
            where: { id: careTypeId, pet_id: petId, is_active: true },
        });

        if (!careType) {
            return reply.status(404).send({ success: false, error: 'Care type not found' });
        }

        const now = new Date();

        // Create log
        const log = await HomePetCareLog.create({
            care_type_id: careType.id,
            done_at: now,
            provider,
            cost,
            notes,
        });

        // Update care type
        let nextDueAt = null;
        if (careType.frequency_days) {
            nextDueAt = new Date(now);
            nextDueAt.setDate(nextDueAt.getDate() + careType.frequency_days);
        }

        await careType.update({
            last_done_at: now,
            next_due_at: nextDueAt,
        });

        return reply.send({ success: true, data: { careType, log } });
    } catch (error) {
        console.error('Error completing pet care:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get pet care schedule
const getPetCareSchedule = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { days = 30 } = request.query;

        const pets = await HomePet.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + parseInt(days));

        const schedule = [];

        for (const pet of pets) {
            const careTypes = await HomePetCareType.findAll({
                where: {
                    pet_id: pet.id,
                    is_active: true,
                    next_due_at: { [Op.not]: null, [Op.between]: [now, futureDate] },
                },
                order: [['next_due_at', 'ASC']],
            });

            for (const care of careTypes) {
                schedule.push({
                    pet,
                    careType: care,
                    dueDate: care.next_due_at,
                });
            }
        }

        schedule.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        return reply.send({ success: true, data: schedule });
    } catch (error) {
        console.error('Error getting pet care schedule:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get pet expenses
const getPetExpenses = async (request, reply) => {
    try {
        const { userId, spaceId, petId } = request.params;
        const { month, year } = request.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        const careTypes = await HomePetCareType.findAll({
            where: { pet_id: petId },
        });

        const logs = await HomePetCareLog.findAll({
            where: {
                care_type_id: { [Op.in]: careTypes.map((c) => c.id) },
                done_at: { [Op.between]: [startDate, endDate] },
                cost: { [Op.not]: null },
            },
            order: [['done_at', 'DESC']],
        });

        const totalCost = logs.reduce((sum, log) => sum + parseFloat(log.cost || 0), 0);

        return reply.send({
            success: true,
            data: {
                month: targetMonth,
                year: targetYear,
                totalCost,
                logs,
            },
        });
    } catch (error) {
        console.error('Error getting pet expenses:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    getPets,
    getPet,
    createPet,
    updatePet,
    deletePet,
    addPetCareType,
    completePetCare,
    getPetCareSchedule,
    getPetExpenses,
};

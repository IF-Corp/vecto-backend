const { Op } = require('sequelize');
const sequelize = require('../config/sequelize');

// Analyze energy patterns over multiple weeks
const analyzeEnergyPatterns = async (userId, weeks = 4) => {
    const { WorkEnergyLog, WorkDailyStandup, WorkEndOfDayReview, WorkModeSession } = require('../models');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    // Get all energy logs
    const energyLogs = await WorkEnergyLog.findAll({
        where: {
            userId,
            timestamp: { [Op.gte]: startDate, [Op.lte]: endDate },
        },
        order: [['timestamp', 'ASC']],
    });

    // Also pull energy from daily standups
    const standups = await WorkDailyStandup.findAll({
        where: {
            userId,
            date: { [Op.gte]: startDate, [Op.lte]: endDate },
        },
    });

    // And from end of day reviews (productivity as proxy for energy)
    const reviews = await WorkEndOfDayReview.findAll({
        where: {
            userId,
            date: { [Op.gte]: startDate, [Op.lte]: endDate },
        },
    });

    // Build hourly energy map
    const hourlyEnergy = {};
    for (let h = 6; h <= 22; h++) {
        hourlyEnergy[h] = { total: 0, count: 0 };
    }

    // Process energy logs
    for (const log of energyLogs) {
        const hour = new Date(log.timestamp).getHours();
        if (hourlyEnergy[hour]) {
            // Scale 1-10 energy to contribution
            hourlyEnergy[hour].total += log.energyLevel;
            hourlyEnergy[hour].count++;
        }
    }

    // Process standups (morning energy, assume ~9am)
    for (const standup of standups) {
        // Scale 1-5 energy to 1-10
        const scaledEnergy = standup.energyLevel * 2;
        if (hourlyEnergy[9]) {
            hourlyEnergy[9].total += scaledEnergy;
            hourlyEnergy[9].count++;
        }
    }

    // Process end of day reviews (evening productivity, assume ~18h)
    for (const review of reviews) {
        // Use productivity rating as evening energy proxy
        const scaledEnergy = review.productivityRating * 2;
        if (hourlyEnergy[18]) {
            hourlyEnergy[18].total += scaledEnergy;
            hourlyEnergy[18].count++;
        }
    }

    // Calculate averages
    const hourlyAverages = {};
    for (const [hour, data] of Object.entries(hourlyEnergy)) {
        hourlyAverages[hour] = data.count > 0
            ? Math.round((data.total / data.count) * 10) / 10
            : null;
    }

    // Determine data sufficiency
    const totalDataPoints = energyLogs.length + standups.length + reviews.length;
    const hasEnoughData = totalDataPoints >= 14; // At least 2 weeks of some data

    return {
        hourlyAverages,
        totalDataPoints,
        weeksAnalyzed: weeks,
        hasEnoughData,
    };
};

// Find peak productivity hours
const findPeakHours = async (userId) => {
    const patterns = await analyzeEnergyPatterns(userId, 4);
    const { hourlyAverages, hasEnoughData } = patterns;

    if (!hasEnoughData) {
        return {
            hasEnoughData: false,
            message: 'Precisa de mais dados. Continue registrando sua energia por pelo menos 2 semanas.',
            peakHours: null,
            lowHours: null,
            secondPeak: null,
        };
    }

    // Find hours with actual data
    const validHours = Object.entries(hourlyAverages)
        .filter(([_, avg]) => avg !== null)
        .map(([hour, avg]) => ({ hour: parseInt(hour), energy: avg }))
        .sort((a, b) => b.energy - a.energy);

    if (validHours.length < 3) {
        return {
            hasEnoughData: false,
            message: 'Dados insuficientes para analise completa.',
            peakHours: null,
            lowHours: null,
            secondPeak: null,
        };
    }

    // Find peak (top hours)
    const peakHour = validHours[0];
    const peakStart = Math.max(6, peakHour.hour - 1);
    const peakEnd = Math.min(22, peakHour.hour + 2);

    // Find low energy period
    const sortedByLow = [...validHours].sort((a, b) => a.energy - b.energy);
    const lowHour = sortedByLow[0];
    const lowStart = Math.max(6, lowHour.hour - 1);
    const lowEnd = Math.min(22, lowHour.hour + 1);

    // Find second peak (not adjacent to first)
    const secondPeakCandidates = validHours.filter(h =>
        Math.abs(h.hour - peakHour.hour) >= 3
    );
    const secondPeak = secondPeakCandidates.length > 0 ? secondPeakCandidates[0] : null;

    return {
        hasEnoughData: true,
        peakHours: {
            start: `${String(peakStart).padStart(2, '0')}:00`,
            end: `${String(peakEnd).padStart(2, '0')}:00`,
            energy: peakHour.energy,
            label: 'Pico de produtividade',
        },
        lowHours: {
            start: `${String(lowStart).padStart(2, '0')}:00`,
            end: `${String(lowEnd).padStart(2, '0')}:00`,
            energy: lowHour.energy,
            label: 'Baixa energia',
        },
        secondPeak: secondPeak ? {
            start: `${String(Math.max(6, secondPeak.hour - 1)).padStart(2, '0')}:00`,
            end: `${String(Math.min(22, secondPeak.hour + 1)).padStart(2, '0')}:00`,
            energy: secondPeak.energy,
            label: 'Segundo pico',
        } : null,
    };
};

// Generate energy-based suggestions
const generateEnergyBasedSuggestions = async (userId) => {
    const peakAnalysis = await findPeakHours(userId);

    if (!peakAnalysis.hasEnoughData) {
        return {
            hasEnoughData: false,
            suggestions: [{
                type: 'info',
                message: 'Continue registrando sua energia para receber sugestoes personalizadas.',
            }],
        };
    }

    const suggestions = [];

    // Deep work suggestion
    if (peakAnalysis.peakHours) {
        suggestions.push({
            type: 'recommendation',
            category: 'deep_work',
            message: `Agende Deep Work entre ${peakAnalysis.peakHours.start} e ${peakAnalysis.peakHours.end}`,
            reason: 'Este e seu horario de pico de energia.',
        });
    }

    // Low energy period suggestion
    if (peakAnalysis.lowHours) {
        suggestions.push({
            type: 'recommendation',
            category: 'admin',
            message: `Use ${peakAnalysis.lowHours.start} a ${peakAnalysis.lowHours.end} para emails e tarefas administrativas`,
            reason: 'Seu nivel de energia e mais baixo neste periodo.',
        });
    }

    // Second peak suggestion
    if (peakAnalysis.secondPeak) {
        suggestions.push({
            type: 'recommendation',
            category: 'creative',
            message: `Reunioes criativas funcionam bem entre ${peakAnalysis.secondPeak.start} e ${peakAnalysis.secondPeak.end}`,
            reason: 'Este e seu segundo pico de produtividade.',
        });
    }

    return {
        hasEnoughData: true,
        suggestions,
        peakAnalysis,
    };
};

// Log energy level
const logEnergyLevel = async (userId, data) => {
    const { WorkEnergyLog } = require('../models');

    const log = await WorkEnergyLog.create({
        userId,
        timestamp: data.timestamp || new Date(),
        energyLevel: data.energyLevel,
        activityType: data.activityType,
        source: data.source || 'manual',
        notes: data.notes,
    });

    return log;
};

// Get energy mapping data
const getEnergyMapping = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { weeks } = request.query;

        const patterns = await analyzeEnergyPatterns(userId, parseInt(weeks) || 4);
        const peaks = await findPeakHours(userId);
        const suggestions = await generateEnergyBasedSuggestions(userId);

        return reply.send({
            patterns,
            peaks,
            suggestions: suggestions.suggestions,
            hasEnoughData: patterns.hasEnoughData,
        });
    } catch (error) {
        console.error('Error getting energy mapping:', error);
        return reply.status(500).send({ error: 'Failed to get energy mapping' });
    }
};

// Create energy log endpoint
const createEnergyLog = async (request, reply) => {
    try {
        const { userId } = request.params;
        const log = await logEnergyLevel(userId, request.body);
        return reply.status(201).send(log);
    } catch (error) {
        console.error('Error creating energy log:', error);
        return reply.status(500).send({ error: 'Failed to create energy log' });
    }
};

// Get energy logs
const getEnergyLogs = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { days } = request.query;
        const { WorkEnergyLog } = require('../models');

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - (parseInt(days) || 7));

        const logs = await WorkEnergyLog.findAll({
            where: {
                userId,
                timestamp: { [Op.gte]: startDate },
            },
            order: [['timestamp', 'DESC']],
        });

        return reply.send(logs);
    } catch (error) {
        console.error('Error getting energy logs:', error);
        return reply.status(500).send({ error: 'Failed to get energy logs' });
    }
};

module.exports = {
    analyzeEnergyPatterns,
    findPeakHours,
    generateEnergyBasedSuggestions,
    logEnergyLevel,
    getEnergyMapping,
    createEnergyLog,
    getEnergyLogs,
};

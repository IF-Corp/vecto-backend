const { Op } = require('sequelize');
const sequelize = require('../config/sequelize');

// Helper to get date range
const getDateRange = (date, days = 1) => {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + days);
    endDate.setHours(0, 0, 0, 0);
    return { startDate, endDate };
};

// Helper to get start of week
const getStartOfWeek = (date, weekStartDay = 1) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day < weekStartDay ? 7 : 0) + day - weekStartDay;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

// Calculate score color based on value (0-10)
const getScoreColor = (score, inverted = false) => {
    if (inverted) {
        // For strain, lower is better
        if (score <= 4) return 'green';
        if (score <= 7) return 'yellow';
        return 'red';
    }
    // For recovery/balance, higher is better
    if (score >= 8) return 'green';
    if (score >= 5) return 'yellow';
    return 'red';
};

// ==================== WORK STRAIN ====================

// Calculate work strain for a specific date
const calculateWorkStrain = async (userId, date = new Date()) => {
    const { WorkTimesheet, WorkMeeting, WorkTask, WorkModeSession, WorkProfile } = require('../models');
    const { startDate, endDate } = getDateRange(date);

    // Get user's work profile for limits
    const profile = await WorkProfile.findOne({ where: { userId } });
    const dailyLimit = profile?.dailyHoursLimit || 8;

    // Factor 1: Hours worked today
    const timesheetEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: startDate, [Op.lt]: endDate },
        },
    });

    let totalSeconds = 0;
    for (const entry of timesheetEntries) {
        const start = new Date(entry.startedAt);
        const end = entry.endedAt ? new Date(entry.endedAt) : new Date();
        totalSeconds += (end - start) / 1000;
    }
    const hoursWorked = totalSeconds / 3600;
    const hoursStrain = Math.min(10, (hoursWorked / dailyLimit) * 7); // 7 at limit, up to 10

    // Factor 2: Meeting hours today
    const meetings = await WorkMeeting.findAll({
        where: {
            userId,
            date: { [Op.gte]: startDate, [Op.lt]: endDate },
        },
    });
    const meetingMinutes = meetings.reduce((sum, m) => sum + (m.duration || 60), 0);
    const meetingHours = meetingMinutes / 60;
    const meetingPercentage = hoursWorked > 0 ? (meetingHours / hoursWorked) * 100 : 0;
    const meetingStrain = Math.min(10, meetingPercentage / 10); // 10 at 100%

    // Factor 3: Deadlines in next 3 days
    const deadlineEnd = new Date(date);
    deadlineEnd.setDate(deadlineEnd.getDate() + 3);
    const upcomingDeadlines = await WorkTask.count({
        where: {
            userId,
            deadline: { [Op.gte]: date, [Op.lt]: deadlineEnd },
            completedAt: null,
        },
    });
    const deadlineStrain = Math.min(10, upcomingDeadlines * 1.5); // ~7 at 5 deadlines

    // Factor 4: Context switches (unique projects/tasks worked on)
    const uniqueProjects = new Set(timesheetEntries.map(e => e.projectId).filter(Boolean));
    const uniqueTasks = new Set(timesheetEntries.map(e => e.taskId).filter(Boolean));
    const contextSwitches = Math.max(uniqueProjects.size, uniqueTasks.size);
    const switchStrain = Math.min(10, contextSwitches * 1.2); // ~6 at 5 switches

    // Calculate weighted average
    const weights = { hours: 0.35, meetings: 0.25, deadlines: 0.2, switches: 0.2 };
    const strainScore = (
        hoursStrain * weights.hours +
        meetingStrain * weights.meetings +
        deadlineStrain * weights.deadlines +
        switchStrain * weights.switches
    );

    return {
        score: Math.round(strainScore * 10) / 10,
        color: getScoreColor(strainScore, true),
        factors: {
            hoursWorked: {
                value: Math.round(hoursWorked * 10) / 10,
                limit: dailyLimit,
                strain: Math.round(hoursStrain * 10) / 10,
                status: hoursWorked > dailyLimit ? 'high' : hoursWorked > dailyLimit * 0.8 ? 'medium' : 'low',
            },
            meetings: {
                hours: Math.round(meetingHours * 10) / 10,
                percentage: Math.round(meetingPercentage),
                strain: Math.round(meetingStrain * 10) / 10,
                status: meetingPercentage > 50 ? 'high' : meetingPercentage > 30 ? 'medium' : 'low',
            },
            deadlines: {
                count: upcomingDeadlines,
                strain: Math.round(deadlineStrain * 10) / 10,
                status: upcomingDeadlines > 5 ? 'high' : upcomingDeadlines > 2 ? 'medium' : 'low',
            },
            contextSwitches: {
                count: contextSwitches,
                strain: Math.round(switchStrain * 10) / 10,
                status: contextSwitches > 6 ? 'high' : contextSwitches > 3 ? 'medium' : 'low',
            },
        },
    };
};

// Get strain history for the last N days
const getStrainHistory = async (userId, days = 7) => {
    const history = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const strain = await calculateWorkStrain(userId, date);
        history.push({
            date: date.toISOString().split('T')[0],
            score: strain.score,
            color: strain.color,
        });
    }

    return history;
};

// Check burnout risk
const checkBurnoutRisk = async (userId) => {
    const history = await getStrainHistory(userId, 7);
    const highStrainDays = history.filter(h => h.score >= 7).length;
    const consecutiveHighDays = getConsecutiveHighDays(history);

    return {
        atRisk: consecutiveHighDays >= 3 || highStrainDays >= 5,
        consecutiveHighDays,
        highStrainDays,
        averageStrain: Math.round((history.reduce((sum, h) => sum + h.score, 0) / history.length) * 10) / 10,
        recommendation: consecutiveHighDays >= 3
            ? 'Strain alto por varios dias consecutivos. Considere tirar uma folga.'
            : highStrainDays >= 5
                ? 'Muitos dias de alta carga esta semana. Reduza o ritmo se possivel.'
                : 'Carga de trabalho dentro do esperado.',
    };
};

const getConsecutiveHighDays = (history) => {
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    for (const day of history) {
        if (day.score >= 7) {
            currentConsecutive++;
            maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
        } else {
            currentConsecutive = 0;
        }
    }
    return maxConsecutive;
};

// ==================== WORK RECOVERY ====================

// Calculate work recovery score
const calculateWorkRecovery = async (userId) => {
    const { WorkProfile, WorkTimesheet, HealthSleepLog, WorkDailyStandup } = require('../models');
    const today = new Date();

    // Get user profile
    const profile = await WorkProfile.findOne({ where: { userId } });
    const weeklyTarget = profile?.weeklyHoursTarget || 40;

    // Factor 1: Sleep recovery (from Health module if available)
    let sleepScore = 7; // Default if no data
    try {
        const lastSleep = await HealthSleepLog.findOne({
            where: { userId },
            order: [['date', 'DESC']],
        });
        if (lastSleep) {
            // Calculate based on hours slept vs recommended (7-9h)
            const hoursSlept = lastSleep.duration / 60;
            if (hoursSlept >= 7 && hoursSlept <= 9) sleepScore = 10;
            else if (hoursSlept >= 6 || hoursSlept <= 10) sleepScore = 7;
            else sleepScore = 4;
        }
    } catch (e) {
        // Health module might not exist, use default
    }

    // Factor 2: Recent strain (inverse of strain)
    const strainData = await calculateWorkStrain(userId);
    const strainRecoveryImpact = 10 - strainData.score;

    // Factor 3: Days since last day off
    const daysSinceOff = await calculateDaysSinceOff(userId);
    const restScore = daysSinceOff <= 2 ? 10 : daysSinceOff <= 5 ? 7 : daysSinceOff <= 7 ? 5 : 3;

    // Factor 4: Weekly hours worked
    const weekStart = getStartOfWeek(today, profile?.weekStartDay || 1);
    const timesheetEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: weekStart },
        },
    });
    let weeklySeconds = 0;
    for (const entry of timesheetEntries) {
        const start = new Date(entry.startedAt);
        const end = entry.endedAt ? new Date(entry.endedAt) : new Date();
        weeklySeconds += (end - start) / 1000;
    }
    const weeklyHours = weeklySeconds / 3600;
    const weeklyScore = weeklyHours <= weeklyTarget ? 10 : weeklyHours <= weeklyTarget * 1.1 ? 7 : 4;

    // Calculate weighted average
    const weights = { sleep: 0.3, strain: 0.3, rest: 0.2, weekly: 0.2 };
    const recoveryScore = (
        sleepScore * weights.sleep +
        strainRecoveryImpact * weights.strain +
        restScore * weights.rest +
        weeklyScore * weights.weekly
    );

    // Get recommendation based on score
    const recommendation = getWorkRecommendation(recoveryScore);

    return {
        score: Math.round(recoveryScore * 10) / 10,
        color: getScoreColor(recoveryScore),
        recommendation,
        factors: {
            sleep: {
                score: sleepScore,
                status: sleepScore >= 8 ? 'good' : sleepScore >= 5 ? 'moderate' : 'low',
            },
            recentStrain: {
                score: Math.round(strainRecoveryImpact * 10) / 10,
                strainLevel: strainData.score,
                status: strainRecoveryImpact >= 5 ? 'good' : 'high_strain',
            },
            daysSinceRest: {
                days: daysSinceOff,
                score: restScore,
                status: daysSinceOff <= 5 ? 'good' : daysSinceOff <= 7 ? 'moderate' : 'needs_rest',
            },
            weeklyHours: {
                hours: Math.round(weeklyHours * 10) / 10,
                target: weeklyTarget,
                score: weeklyScore,
                status: weeklyHours <= weeklyTarget ? 'good' : 'overtime',
            },
        },
    };
};

const calculateDaysSinceOff = async (userId) => {
    const { WorkTimesheet } = require('../models');
    const today = new Date();
    let daysSinceOff = 0;

    for (let i = 1; i <= 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - i);
        const { startDate, endDate } = getDateRange(checkDate);

        const entries = await WorkTimesheet.findOne({
            where: {
                userId,
                startedAt: { [Op.gte]: startDate, [Op.lt]: endDate },
            },
        });

        if (!entries) {
            return daysSinceOff;
        }
        daysSinceOff++;
    }

    return daysSinceOff;
};

const getWorkRecommendation = (recoveryScore) => {
    if (recoveryScore >= 8) {
        return {
            level: 'excellent',
            title: 'Otimo para trabalho intenso',
            message: 'Voce esta bem recuperado. Bom momento para Deep Work e tarefas desafiadoras.',
        };
    }
    if (recoveryScore >= 6) {
        return {
            level: 'good',
            title: 'Moderado',
            message: 'Foque em tarefas de manutencao e reunioes. Evite trabalho muito intenso.',
        };
    }
    if (recoveryScore >= 4) {
        return {
            level: 'caution',
            title: 'Precisa de descanso',
            message: 'Priorize tarefas leves e administrativas. Considere encerrar mais cedo.',
        };
    }
    return {
        level: 'warning',
        title: 'Descanse',
        message: 'Recuperacao muito baixa. Considere tirar uma folga ou dia mais leve.',
    };
};

// ==================== WORK-LIFE BALANCE ====================

// Calculate work-life balance score
const calculateWorkLifeBalance = async (userId) => {
    const { WorkProfile, WorkTimesheet } = require('../models');
    const today = new Date();
    const profile = await WorkProfile.findOne({ where: { userId } });
    const weeklyTarget = profile?.weeklyHoursTarget || 40;
    const dailyLimit = profile?.dailyHoursLimit || 8;

    // Factor 1: Weekly hours vs target
    const weekStart = getStartOfWeek(today, profile?.weekStartDay || 1);
    const timesheetEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: weekStart },
        },
    });

    let weeklySeconds = 0;
    for (const entry of timesheetEntries) {
        const start = new Date(entry.startedAt);
        const end = entry.endedAt ? new Date(entry.endedAt) : new Date();
        weeklySeconds += (end - start) / 1000;
    }
    const weeklyHours = weeklySeconds / 3600;
    const hoursRatio = weeklyHours / weeklyTarget;
    const hoursScore = hoursRatio <= 1 ? 10 : hoursRatio <= 1.1 ? 8 : hoursRatio <= 1.2 ? 5 : 2;

    // Factor 2: Weekend work
    const weekendEntries = timesheetEntries.filter(e => {
        const day = new Date(e.startedAt).getDay();
        return day === 0 || day === 6;
    });
    let weekendSeconds = 0;
    for (const entry of weekendEntries) {
        const start = new Date(entry.startedAt);
        const end = entry.endedAt ? new Date(entry.endedAt) : new Date();
        weekendSeconds += (end - start) / 1000;
    }
    const weekendHours = weekendSeconds / 3600;
    const weekendScore = weekendHours === 0 ? 10 : weekendHours <= 2 ? 7 : weekendHours <= 4 ? 4 : 1;

    // Factor 3: Average end time (last 7 days)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: sevenDaysAgo },
            endedAt: { [Op.not]: null },
        },
        order: [['endedAt', 'DESC']],
    });

    // Get last entry per day
    const endTimesByDay = {};
    for (const entry of recentEntries) {
        const dateKey = new Date(entry.endedAt).toISOString().split('T')[0];
        if (!endTimesByDay[dateKey]) {
            endTimesByDay[dateKey] = new Date(entry.endedAt).getHours() + new Date(entry.endedAt).getMinutes() / 60;
        }
    }
    const endTimes = Object.values(endTimesByDay);
    const avgEndTime = endTimes.length > 0 ? endTimes.reduce((a, b) => a + b, 0) / endTimes.length : 18;
    const endTimeScore = avgEndTime <= 18 ? 10 : avgEndTime <= 19 ? 8 : avgEndTime <= 20 ? 5 : 2;

    // Factor 4: Days without break
    const daysSinceOff = await calculateDaysSinceOff(userId);
    const restScore = daysSinceOff <= 5 ? 10 : daysSinceOff <= 7 ? 7 : daysSinceOff <= 10 ? 4 : 1;

    // Calculate weighted average
    const weights = { hours: 0.3, weekend: 0.25, endTime: 0.2, rest: 0.25 };
    const balanceScore = (
        hoursScore * weights.hours +
        weekendScore * weights.weekend +
        endTimeScore * weights.endTime +
        restScore * weights.rest
    );

    // Generate suggestions
    const suggestions = generateWorkLifeSuggestions({
        weeklyHours,
        weeklyTarget,
        weekendHours,
        avgEndTime,
        daysSinceOff,
    });

    return {
        score: Math.round(balanceScore * 10) / 10,
        color: getScoreColor(balanceScore),
        factors: {
            weeklyHours: {
                hours: Math.round(weeklyHours * 10) / 10,
                target: weeklyTarget,
                score: hoursScore,
                status: hoursScore >= 8 ? 'good' : hoursScore >= 5 ? 'moderate' : 'overtime',
            },
            weekendWork: {
                hours: Math.round(weekendHours * 10) / 10,
                score: weekendScore,
                status: weekendScore >= 8 ? 'good' : weekendScore >= 5 ? 'some' : 'too_much',
            },
            averageEndTime: {
                time: `${Math.floor(avgEndTime)}:${String(Math.round((avgEndTime % 1) * 60)).padStart(2, '0')}`,
                score: endTimeScore,
                status: endTimeScore >= 8 ? 'good' : endTimeScore >= 5 ? 'late' : 'very_late',
            },
            daysSinceRest: {
                days: daysSinceOff,
                score: restScore,
                status: restScore >= 8 ? 'good' : restScore >= 5 ? 'needs_break' : 'overdue',
            },
        },
        suggestions,
    };
};

const generateWorkLifeSuggestions = ({ weeklyHours, weeklyTarget, weekendHours, avgEndTime, daysSinceOff }) => {
    const suggestions = [];

    if (daysSinceOff > 7) {
        suggestions.push({
            type: 'warning',
            message: `Voce esta ha ${daysSinceOff} dias sem folga. Tire um dia de descanso.`,
        });
    }

    if (weekendHours > 2) {
        suggestions.push({
            type: 'warning',
            message: 'Evite trabalhar no proximo fim de semana para recarregar.',
        });
    }

    if (weeklyHours > weeklyTarget * 1.1) {
        suggestions.push({
            type: 'suggestion',
            message: 'Tente reduzir as horas trabalhadas para ficar dentro da meta semanal.',
        });
    }

    if (avgEndTime > 19) {
        suggestions.push({
            type: 'suggestion',
            message: 'Estabeleca um horario de termino mais cedo para melhorar o equilibrio.',
        });
    }

    if (suggestions.length === 0) {
        suggestions.push({
            type: 'info',
            message: 'Seu equilibrio trabalho-vida esta bom! Continue assim.',
        });
    }

    return suggestions;
};

// ==================== ENDPOINTS ====================

const getWorkStrain = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { date } = request.query;

        const targetDate = date ? new Date(date) : new Date();
        const strain = await calculateWorkStrain(userId, targetDate);
        const history = await getStrainHistory(userId, 7);
        const burnoutRisk = await checkBurnoutRisk(userId);

        return reply.send({
            ...strain,
            history,
            burnoutRisk,
        });
    } catch (error) {
        console.error('Error getting work strain:', error);
        return reply.status(500).send({ error: 'Failed to get work strain' });
    }
};

const getWorkRecovery = async (request, reply) => {
    try {
        const { userId } = request.params;
        const recovery = await calculateWorkRecovery(userId);
        return reply.send(recovery);
    } catch (error) {
        console.error('Error getting work recovery:', error);
        return reply.status(500).send({ error: 'Failed to get work recovery' });
    }
};

const getWorkLifeBalance = async (request, reply) => {
    try {
        const { userId } = request.params;
        const balance = await calculateWorkLifeBalance(userId);
        return reply.send(balance);
    } catch (error) {
        console.error('Error getting work-life balance:', error);
        return reply.status(500).send({ error: 'Failed to get work-life balance' });
    }
};

module.exports = {
    calculateWorkStrain,
    getStrainHistory,
    checkBurnoutRisk,
    calculateWorkRecovery,
    calculateWorkLifeBalance,
    getWorkStrain,
    getWorkRecovery,
    getWorkLifeBalance,
};

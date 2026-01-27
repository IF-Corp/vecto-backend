const { Op } = require('sequelize');
const sequelize = require('../config/sequelize');

// Detect context switches for a given day
const detectContextSwitches = async (userId, date = new Date()) => {
    const { WorkTimesheet, WorkTask, WorkProject } = require('../models');

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    endDate.setHours(0, 0, 0, 0);

    // Get all timesheet entries for the day, ordered by start time
    const entries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: startDate, [Op.lt]: endDate },
        },
        include: [
            { model: WorkTask, as: 'task', attributes: ['id', 'title', 'projectId'] },
            { model: WorkProject, as: 'project', attributes: ['id', 'name', 'color'] },
        ],
        order: [['startedAt', 'ASC']],
    });

    if (entries.length === 0) {
        return {
            totalSwitches: 0,
            switches: [],
            timeline: [],
            uniqueProjects: 0,
            uniqueTasks: 0,
        };
    }

    const switches = [];
    const timeline = [];
    let previousEntry = null;

    for (const entry of entries) {
        const startTime = new Date(entry.startedAt);
        const endTime = entry.endedAt ? new Date(entry.endedAt) : new Date();
        const durationMinutes = Math.round((endTime - startTime) / 60000);

        // Build timeline item
        const timelineItem = {
            id: entry.id,
            startTime: startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            endTime: endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            duration: durationMinutes,
            durationFormatted: formatDuration(durationMinutes),
            projectId: entry.projectId,
            projectName: entry.project?.name || 'Sem projeto',
            projectColor: entry.project?.color || '#6b7280',
            taskId: entry.taskId,
            taskTitle: entry.task?.title || entry.description || 'Sem descricao',
            description: entry.description,
        };
        timeline.push(timelineItem);

        // Detect switch from previous entry
        if (previousEntry) {
            const isSwitch = (
                entry.projectId !== previousEntry.projectId ||
                entry.taskId !== previousEntry.taskId
            );

            if (isSwitch) {
                switches.push({
                    time: startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    from: {
                        projectName: previousEntry.project?.name || 'Sem projeto',
                        taskTitle: previousEntry.task?.title || previousEntry.description || 'Sem tarefa',
                    },
                    to: {
                        projectName: entry.project?.name || 'Sem projeto',
                        taskTitle: entry.task?.title || entry.description || 'Sem tarefa',
                    },
                    focusedMinutesBefore: Math.round((new Date(previousEntry.endedAt || startTime) - new Date(previousEntry.startedAt)) / 60000),
                });
            }
        }

        previousEntry = entry;
    }

    // Count unique projects and tasks
    const uniqueProjects = new Set(entries.map(e => e.projectId).filter(Boolean)).size;
    const uniqueTasks = new Set(entries.map(e => e.taskId).filter(Boolean)).size;

    return {
        totalSwitches: switches.length,
        switches,
        timeline,
        uniqueProjects,
        uniqueTasks,
    };
};

// Calculate average focus time before switching
const calculateAverageFocusTime = async (userId, date = new Date()) => {
    const { switches, timeline } = await detectContextSwitches(userId, date);

    if (timeline.length === 0) {
        return {
            averageMinutes: 0,
            averageFormatted: '0min',
            idealMinutes: 45,
            isAboveIdeal: false,
        };
    }

    // Calculate focus times (duration of each session)
    const focusTimes = timeline.map(t => t.duration);
    const totalFocusTime = focusTimes.reduce((sum, t) => sum + t, 0);
    const averageMinutes = Math.round(totalFocusTime / timeline.length);

    return {
        averageMinutes,
        averageFormatted: formatDuration(averageMinutes),
        idealMinutes: 45,
        isAboveIdeal: averageMinutes >= 45,
        totalFocusedTime: totalFocusTime,
        totalFocusedFormatted: formatDuration(totalFocusTime),
    };
};

// Estimate productivity loss from context switching
const estimateProductivityLoss = (switches, avgFocusMinutes) => {
    // Research suggests each context switch costs 15-25 minutes of productivity
    // We use a sliding scale based on average focus time
    const baseCostMinutes = avgFocusMinutes >= 45 ? 15 : avgFocusMinutes >= 25 ? 20 : 25;

    const totalLostMinutes = switches * baseCostMinutes;
    const hours = Math.floor(totalLostMinutes / 60);
    const minutes = totalLostMinutes % 60;

    return {
        totalLostMinutes,
        formatted: hours > 0 ? `~${hours}h ${minutes}min` : `~${minutes}min`,
        costPerSwitch: baseCostMinutes,
        severity: totalLostMinutes > 120 ? 'high' : totalLostMinutes > 60 ? 'medium' : 'low',
    };
};

// Suggest task grouping
const suggestTaskGrouping = async (userId) => {
    const { WorkTask, WorkTimesheet, WorkProject } = require('../models');

    // Get tasks worked on in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: sevenDaysAgo },
        },
        include: [
            { model: WorkTask, as: 'task', attributes: ['id', 'title', 'projectId'] },
            { model: WorkProject, as: 'project', attributes: ['id', 'name', 'color'] },
        ],
    });

    // Group by project
    const projectGroups = {};
    for (const entry of recentEntries) {
        const projectId = entry.projectId || 'no_project';
        const projectName = entry.project?.name || 'Sem projeto';

        if (!projectGroups[projectId]) {
            projectGroups[projectId] = {
                projectId,
                projectName,
                projectColor: entry.project?.color || '#6b7280',
                tasks: new Set(),
                totalMinutes: 0,
                entriesCount: 0,
            };
        }

        if (entry.task) {
            projectGroups[projectId].tasks.add(JSON.stringify({
                id: entry.task.id,
                title: entry.task.title,
            }));
        }

        const duration = entry.endedAt
            ? (new Date(entry.endedAt) - new Date(entry.startedAt)) / 60000
            : 0;
        projectGroups[projectId].totalMinutes += duration;
        projectGroups[projectId].entriesCount++;
    }

    // Convert to array and calculate fragmentation
    const projects = Object.values(projectGroups).map(p => ({
        ...p,
        tasks: [...p.tasks].map(t => JSON.parse(t)),
        totalFormatted: formatDuration(Math.round(p.totalMinutes)),
        fragmentationScore: p.entriesCount / Math.max(1, p.totalMinutes / 60), // Entries per hour
    }));

    // Sort by fragmentation (most fragmented first)
    projects.sort((a, b) => b.fragmentationScore - a.fragmentationScore);

    // Generate suggestions
    const suggestions = [];

    // Find most fragmented projects
    const fragmentedProjects = projects.filter(p => p.fragmentationScore > 2);
    if (fragmentedProjects.length > 0) {
        const projectNames = fragmentedProjects.slice(0, 2).map(p => p.projectName).join(' e ');
        suggestions.push({
            type: 'grouping',
            message: `Agrupe tarefas de ${projectNames} em blocos maiores para reduzir trocas.`,
            projects: fragmentedProjects.slice(0, 2),
        });
    }

    // Suggest time blocking if many projects
    if (projects.length >= 3) {
        suggestions.push({
            type: 'time_blocking',
            message: 'Considere dedicar manha para um projeto e tarde para outro.',
        });
    }

    // If focus time is low
    const avgFocus = await calculateAverageFocusTime(userId);
    if (!avgFocus.isAboveIdeal) {
        suggestions.push({
            type: 'focus',
            message: `Seu tempo medio focado e ${avgFocus.averageFormatted}. Tente sessoes de pelo menos 45min.`,
        });
    }

    return {
        projects: projects.slice(0, 5),
        suggestions,
    };
};

// Helper to format duration
const formatDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

// Get context switching data endpoint
const getContextSwitching = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { date } = request.query;

        const targetDate = date ? new Date(date) : new Date();

        const switchData = await detectContextSwitches(userId, targetDate);
        const focusData = await calculateAverageFocusTime(userId, targetDate);
        const productivityLoss = estimateProductivityLoss(switchData.totalSwitches, focusData.averageMinutes);
        const groupingSuggestions = await suggestTaskGrouping(userId);

        return reply.send({
            date: targetDate.toISOString().split('T')[0],
            switches: switchData.totalSwitches,
            timeline: switchData.timeline,
            switchDetails: switchData.switches,
            uniqueProjects: switchData.uniqueProjects,
            uniqueTasks: switchData.uniqueTasks,
            focus: {
                averageMinutes: focusData.averageMinutes,
                averageFormatted: focusData.averageFormatted,
                idealMinutes: focusData.idealMinutes,
                isAboveIdeal: focusData.isAboveIdeal,
                totalFocusedFormatted: focusData.totalFocusedFormatted,
            },
            productivityLoss,
            suggestions: groupingSuggestions.suggestions,
            projectBreakdown: groupingSuggestions.projects,
        });
    } catch (error) {
        console.error('Error getting context switching:', error);
        return reply.status(500).send({ error: 'Failed to get context switching data' });
    }
};

// Get context switching history (last N days)
const getContextSwitchingHistory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { days } = request.query;
        const numDays = parseInt(days) || 7;

        const history = [];
        const today = new Date();

        for (let i = numDays - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);

            const switchData = await detectContextSwitches(userId, date);
            const focusData = await calculateAverageFocusTime(userId, date);

            history.push({
                date: date.toISOString().split('T')[0],
                switches: switchData.totalSwitches,
                averageFocusMinutes: focusData.averageMinutes,
                uniqueProjects: switchData.uniqueProjects,
            });
        }

        // Calculate averages
        const avgSwitches = Math.round(history.reduce((sum, h) => sum + h.switches, 0) / history.length);
        const avgFocus = Math.round(history.reduce((sum, h) => sum + h.averageFocusMinutes, 0) / history.length);

        return reply.send({
            history,
            averages: {
                switches: avgSwitches,
                focusMinutes: avgFocus,
                focusFormatted: formatDuration(avgFocus),
            },
        });
    } catch (error) {
        console.error('Error getting context switching history:', error);
        return reply.status(500).send({ error: 'Failed to get context switching history' });
    }
};

module.exports = {
    detectContextSwitches,
    calculateAverageFocusTime,
    estimateProductivityLoss,
    suggestTaskGrouping,
    getContextSwitching,
    getContextSwitchingHistory,
};

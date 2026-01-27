const { Op } = require('sequelize');
const sequelize = require('../config/sequelize');

// Helper functions
const getStartOfWeek = (date, weekStartDay = 1) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day < weekStartDay ? 7 : 0) + day - weekStartDay;
    d.setDate(d.getDate() - diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const getEndOfWeek = (startOfWeek) => {
    const end = new Date(startOfWeek);
    end.setDate(end.getDate() + 7);
    return end;
};

const getStartOfMonth = (year, month) => {
    return new Date(year, month - 1, 1, 0, 0, 0, 0);
};

const getEndOfMonth = (year, month) => {
    return new Date(year, month, 0, 23, 59, 59, 999);
};

const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
};

// ==================== WEEKLY REPORT ====================

const calculateWeeklyMetrics = async (userId, weekStart) => {
    const { WorkTimesheet, WorkTask, WorkMeeting, WorkModeSession, WorkProject } = require('../models');
    const weekEnd = getEndOfWeek(weekStart);

    // Get all timesheet entries for the week
    const timesheetEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: weekStart, [Op.lt]: weekEnd },
        },
        include: [
            { model: WorkProject, as: 'project', attributes: ['id', 'name', 'color', 'clientId'] },
        ],
    });

    // Calculate total hours worked
    let totalSeconds = 0;
    const hoursByDay = {};
    const hoursByProject = {};

    for (const entry of timesheetEntries) {
        const start = new Date(entry.startedAt);
        const end = entry.endedAt ? new Date(entry.endedAt) : new Date();
        const seconds = (end - start) / 1000;
        totalSeconds += seconds;

        // By day
        const dayKey = start.toISOString().split('T')[0];
        hoursByDay[dayKey] = (hoursByDay[dayKey] || 0) + seconds / 3600;

        // By project
        const projectKey = entry.projectId || 'no_project';
        if (!hoursByProject[projectKey]) {
            hoursByProject[projectKey] = {
                projectId: entry.projectId,
                projectName: entry.project?.name || 'Sem projeto',
                projectColor: entry.project?.color || '#6b7280',
                hours: 0,
            };
        }
        hoursByProject[projectKey].hours += seconds / 3600;
    }

    const totalHours = totalSeconds / 3600;

    // Get meetings for the week
    const meetings = await WorkMeeting.findAll({
        where: {
            userId,
            date: { [Op.gte]: weekStart, [Op.lt]: weekEnd },
        },
    });

    const meetingMinutes = meetings.reduce((sum, m) => sum + (m.duration || 60), 0);
    const meetingHours = meetingMinutes / 60;

    // Get Deep Work hours from work mode sessions
    const deepWorkSessions = await WorkModeSession.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: weekStart, [Op.lt]: weekEnd },
            status: 'completed',
        },
        include: [{ model: require('../models').WorkMode, as: 'mode' }],
    });

    let deepWorkSeconds = 0;
    for (const session of deepWorkSessions) {
        if (session.mode?.name === 'Deep Work') {
            deepWorkSeconds += session.actualDuration || 0;
        }
    }
    const deepWorkHours = deepWorkSeconds / 3600;

    // Get tasks completed this week
    const tasksCompleted = await WorkTask.count({
        where: {
            userId,
            completedAt: { [Op.gte]: weekStart, [Op.lt]: weekEnd },
        },
    });

    // Get tasks that were planned for this week
    const tasksPlanned = await WorkTask.count({
        where: {
            userId,
            [Op.or]: [
                { scheduledDate: { [Op.gte]: weekStart, [Op.lt]: weekEnd } },
                { deadline: { [Op.gte]: weekStart, [Op.lt]: weekEnd } },
            ],
        },
    });

    // Tasks delivered on time vs late
    const tasksCompletedList = await WorkTask.findAll({
        where: {
            userId,
            completedAt: { [Op.gte]: weekStart, [Op.lt]: weekEnd },
        },
    });

    let onTime = 0;
    let late = 0;
    for (const task of tasksCompletedList) {
        if (task.deadline && new Date(task.completedAt) > new Date(task.deadline)) {
            late++;
        } else {
            onTime++;
        }
    }

    // Calculate overtime (assuming 40h/week target)
    const { WorkProfile } = require('../models');
    const profile = await WorkProfile.findOne({ where: { userId } });
    const weeklyTarget = profile?.weeklyHoursTarget || 40;
    const overtime = Math.max(0, totalHours - weeklyTarget);

    // Admin hours = total - meetings - deep work
    const adminHours = Math.max(0, totalHours - meetingHours - deepWorkHours);

    // Context switches (count unique project/task transitions)
    let contextSwitches = 0;
    let prevProjectId = null;
    for (const entry of timesheetEntries.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))) {
        if (prevProjectId !== null && entry.projectId !== prevProjectId) {
            contextSwitches++;
        }
        prevProjectId = entry.projectId;
    }

    return {
        time: {
            totalHours: Math.round(totalHours * 10) / 10,
            totalFormatted: formatHours(totalHours),
            weeklyTarget,
            deepWorkHours: Math.round(deepWorkHours * 10) / 10,
            deepWorkPercentage: totalHours > 0 ? Math.round((deepWorkHours / totalHours) * 100) : 0,
            meetingHours: Math.round(meetingHours * 10) / 10,
            meetingPercentage: totalHours > 0 ? Math.round((meetingHours / totalHours) * 100) : 0,
            adminHours: Math.round(adminHours * 10) / 10,
            adminPercentage: totalHours > 0 ? Math.round((adminHours / totalHours) * 100) : 0,
            overtime: Math.round(overtime * 10) / 10,
            hoursByDay: Object.entries(hoursByDay).map(([date, hours]) => ({
                date,
                hours: Math.round(hours * 10) / 10,
            })),
        },
        deliveries: {
            tasksCompleted,
            tasksPlanned: Math.max(tasksPlanned, tasksCompleted),
            completionRate: tasksPlanned > 0 ? Math.round((tasksCompleted / tasksPlanned) * 100) : 100,
            onTime,
            late,
        },
        projects: Object.values(hoursByProject)
            .map(p => ({
                ...p,
                hours: Math.round(p.hours * 10) / 10,
                percentage: totalHours > 0 ? Math.round((p.hours / totalHours) * 100) : 0,
            }))
            .sort((a, b) => b.hours - a.hours),
        focus: {
            contextSwitches,
            avgContextSwitchesPerDay: Math.round(contextSwitches / 5 * 10) / 10,
        },
    };
};

const compareWithPreviousWeek = async (userId, weekStart) => {
    const previousWeekStart = new Date(weekStart);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);

    const [currentMetrics, previousMetrics] = await Promise.all([
        calculateWeeklyMetrics(userId, weekStart),
        calculateWeeklyMetrics(userId, previousWeekStart),
    ]);

    const hoursDiff = currentMetrics.time.totalHours - previousMetrics.time.totalHours;
    const tasksDiff = currentMetrics.deliveries.tasksCompleted - previousMetrics.deliveries.tasksCompleted;
    const deepWorkDiff = currentMetrics.time.deepWorkHours - previousMetrics.time.deepWorkHours;

    return {
        hours: {
            current: currentMetrics.time.totalHours,
            previous: previousMetrics.time.totalHours,
            diff: Math.round(hoursDiff * 10) / 10,
            direction: hoursDiff > 0 ? 'up' : hoursDiff < 0 ? 'down' : 'stable',
        },
        tasks: {
            current: currentMetrics.deliveries.tasksCompleted,
            previous: previousMetrics.deliveries.tasksCompleted,
            diff: tasksDiff,
            direction: tasksDiff > 0 ? 'up' : tasksDiff < 0 ? 'down' : 'stable',
        },
        deepWork: {
            current: currentMetrics.time.deepWorkHours,
            previous: previousMetrics.time.deepWorkHours,
            diff: Math.round(deepWorkDiff * 10) / 10,
            direction: deepWorkDiff > 0 ? 'up' : deepWorkDiff < 0 ? 'down' : 'stable',
        },
    };
};

const generateWeeklyInsights = async (userId, weekStart, metrics, comparison, strainData, balanceData) => {
    const insights = [];

    // Overtime insight
    if (metrics.time.overtime > 0) {
        insights.push({
            type: 'warning',
            icon: '⚠️',
            message: `Overtime de ${formatHours(metrics.time.overtime)} - monitore na proxima semana`,
        });
    }

    // Context switches insight
    if (metrics.focus.avgContextSwitchesPerDay > 6) {
        insights.push({
            type: 'warning',
            icon: '🔀',
            message: 'Muitas trocas de contexto podem estar reduzindo seu foco',
        });
    }

    // Deep work insight
    if (metrics.time.deepWorkPercentage < 30) {
        insights.push({
            type: 'suggestion',
            icon: '🎯',
            message: 'Tente aumentar o tempo de Deep Work para maior produtividade',
        });
    }

    // Tasks improvement
    if (comparison.tasks.direction === 'up' && comparison.tasks.diff >= 3) {
        insights.push({
            type: 'positive',
            icon: '📈',
            message: `Bom ritmo de entregas! +${comparison.tasks.diff} tarefas vs semana anterior`,
        });
    }

    // Late deliveries
    if (metrics.deliveries.late > 0) {
        insights.push({
            type: 'warning',
            icon: '⏰',
            message: `${metrics.deliveries.late} tarefa(s) entregue(s) com atraso`,
        });
    }

    // Work-life balance
    if (balanceData && balanceData.score < 5) {
        insights.push({
            type: 'warning',
            icon: '⚖️',
            message: 'Equilibrio trabalho-vida precisa de atencao',
        });
    }

    // Good completion rate
    if (metrics.deliveries.completionRate >= 80) {
        insights.push({
            type: 'positive',
            icon: '✅',
            message: `Otima taxa de conclusao: ${metrics.deliveries.completionRate}%`,
        });
    }

    return insights;
};

const generateWeeklyReport = async (userId, weekStart) => {
    const { calculateWorkStrain, getStrainHistory, calculateWorkLifeBalance } = require('./workAnalyticsController');

    const metrics = await calculateWeeklyMetrics(userId, weekStart);
    const comparison = await compareWithPreviousWeek(userId, weekStart);

    // Get strain and balance averages for the week
    const strainHistory = await getStrainHistory(userId, 7);
    const avgStrain = strainHistory.length > 0
        ? Math.round((strainHistory.reduce((sum, h) => sum + h.score, 0) / strainHistory.length) * 10) / 10
        : null;

    const balanceData = await calculateWorkLifeBalance(userId);

    const insights = await generateWeeklyInsights(userId, weekStart, metrics, comparison, { score: avgStrain }, balanceData);

    // Calculate overall score (weighted average)
    const completionScore = metrics.deliveries.completionRate / 10;
    const balanceScore = balanceData?.score || 5;
    const strainScore = avgStrain ? (10 - avgStrain) : 5; // Inverse strain
    const focusScore = metrics.time.deepWorkPercentage >= 40 ? 8 : metrics.time.deepWorkPercentage >= 25 ? 6 : 4;

    const overallScore = Math.round(
        (completionScore * 0.3 + balanceScore * 0.25 + strainScore * 0.25 + focusScore * 0.2) * 10
    ) / 10;

    return {
        period: {
            start: weekStart.toISOString().split('T')[0],
            end: getEndOfWeek(weekStart).toISOString().split('T')[0],
        },
        score: overallScore,
        scoreEmoji: overallScore >= 7.5 ? '👍' : overallScore >= 5 ? '👌' : '⚠️',
        metrics,
        comparison,
        strain: {
            average: avgStrain,
            history: strainHistory,
        },
        balance: balanceData ? {
            score: balanceData.score,
            color: balanceData.color,
        } : null,
        insights,
    };
};

// ==================== MONTHLY REPORT ====================

const calculateMonthlyMetrics = async (userId, month, year) => {
    const monthStart = getStartOfMonth(year, month);
    const monthEnd = getEndOfMonth(year, month);

    const { WorkTimesheet, WorkTask, WorkMeeting, WorkProject, WorkObjective } = require('../models');

    // Get all timesheet entries for the month
    const timesheetEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: monthStart, [Op.lte]: monthEnd },
        },
        include: [
            { model: WorkProject, as: 'project', attributes: ['id', 'name', 'color', 'clientId'] },
        ],
    });

    let totalSeconds = 0;
    let weekendSeconds = 0;
    const hoursByProject = {};

    for (const entry of timesheetEntries) {
        const start = new Date(entry.startedAt);
        const end = entry.endedAt ? new Date(entry.endedAt) : new Date();
        const seconds = (end - start) / 1000;
        totalSeconds += seconds;

        // Weekend work
        const dayOfWeek = start.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendSeconds += seconds;
        }

        // By project
        const projectKey = entry.projectId || 'no_project';
        if (!hoursByProject[projectKey]) {
            hoursByProject[projectKey] = {
                projectId: entry.projectId,
                projectName: entry.project?.name || 'Sem projeto',
                projectColor: entry.project?.color || '#6b7280',
                clientId: entry.project?.clientId,
                hours: 0,
            };
        }
        hoursByProject[projectKey].hours += seconds / 3600;
    }

    const totalHours = totalSeconds / 3600;
    const weekendHours = weekendSeconds / 3600;

    // Count working days (excluding weekends)
    let workingDays = 0;
    const current = new Date(monthStart);
    while (current <= monthEnd) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) workingDays++;
        current.setDate(current.getDate() + 1);
    }

    const avgDailyHours = workingDays > 0 ? totalHours / workingDays : 0;

    // Count weekend days worked
    const weekendDaysWorked = new Set(
        timesheetEntries
            .filter(e => {
                const day = new Date(e.startedAt).getDay();
                return day === 0 || day === 6;
            })
            .map(e => new Date(e.startedAt).toISOString().split('T')[0])
    ).size;

    // Tasks completed
    const tasksCompleted = await WorkTask.count({
        where: {
            userId,
            completedAt: { [Op.gte]: monthStart, [Op.lte]: monthEnd },
        },
    });

    // Get OKRs progress
    const objectives = await WorkObjective.findAll({
        where: {
            userId,
            status: 'ACTIVE',
        },
    });

    const okrProgress = objectives.map(o => ({
        id: o.id,
        title: o.title,
        progress: o.progress,
    }));

    // Weekly target
    const { WorkProfile } = require('../models');
    const profile = await WorkProfile.findOne({ where: { userId } });
    const weeklyTarget = profile?.weeklyHoursTarget || 40;
    const monthlyTarget = weeklyTarget * 4;
    const overtime = Math.max(0, totalHours - monthlyTarget);

    return {
        time: {
            totalHours: Math.round(totalHours * 10) / 10,
            totalFormatted: formatHours(totalHours),
            avgDailyHours: Math.round(avgDailyHours * 10) / 10,
            weekendHours: Math.round(weekendHours * 10) / 10,
            weekendDaysWorked,
            overtime: Math.round(overtime * 10) / 10,
            monthlyTarget,
        },
        deliveries: {
            tasksCompleted,
        },
        projects: Object.values(hoursByProject)
            .map(p => ({
                ...p,
                hours: Math.round(p.hours * 10) / 10,
                percentage: totalHours > 0 ? Math.round((p.hours / totalHours) * 100) : 0,
            }))
            .sort((a, b) => b.hours - a.hours),
        okrProgress,
    };
};

const getWeeklyTrends = async (userId, month, year) => {
    const monthStart = getStartOfMonth(year, month);
    const trends = [];

    // Get 4-5 weeks of the month
    let weekStart = getStartOfWeek(monthStart);
    while (weekStart.getMonth() === month - 1 || weekStart < monthStart) {
        weekStart.setDate(weekStart.getDate() + 7);
    }
    weekStart = getStartOfWeek(monthStart);

    for (let i = 0; i < 5; i++) {
        const weekEnd = getEndOfWeek(weekStart);
        if (weekStart.getMonth() > month - 1 && weekStart.getFullYear() >= year) break;

        try {
            const report = await generateWeeklyReport(userId, new Date(weekStart));
            trends.push({
                weekNumber: i + 1,
                weekStart: weekStart.toISOString().split('T')[0],
                score: report.score,
                hours: report.metrics.time.totalHours,
                tasks: report.metrics.deliveries.tasksCompleted,
            });
        } catch (e) {
            // Skip weeks with no data
        }

        weekStart.setDate(weekStart.getDate() + 7);
    }

    // Calculate trend direction
    if (trends.length >= 2) {
        const lastTwo = trends.slice(-2);
        const scoreDiff = lastTwo[1].score - lastTwo[0].score;
        return {
            weeks: trends,
            trend: scoreDiff > 0 ? 'up' : scoreDiff < 0 ? 'down' : 'stable',
            message: scoreDiff > 0 ? 'Tendencia positiva' : scoreDiff < 0 ? 'Tendencia de queda' : 'Estavel',
        };
    }

    return { weeks: trends, trend: 'stable', message: 'Dados insuficientes' };
};

const generateMonthlyReport = async (userId, month, year) => {
    const metrics = await calculateMonthlyMetrics(userId, month, year);
    const weeklyTrends = await getWeeklyTrends(userId, month, year);

    // Calculate overall score
    const avgWeeklyScore = weeklyTrends.weeks.length > 0
        ? weeklyTrends.weeks.reduce((sum, w) => sum + w.score, 0) / weeklyTrends.weeks.length
        : 5;

    return {
        period: {
            month,
            year,
            label: new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        },
        score: Math.round(avgWeeklyScore * 10) / 10,
        scoreEmoji: avgWeeklyScore >= 7.5 ? '👍' : avgWeeklyScore >= 5 ? '👌' : '⚠️',
        metrics,
        weeklyTrends,
    };
};

// ==================== BILLING REPORT ====================

const generateBillingReport = async (userId, month, year) => {
    const monthStart = getStartOfMonth(year, month);
    const monthEnd = getEndOfMonth(year, month);

    const { WorkTimesheet, WorkInvoice, WorkClient, WorkProject } = require('../models');

    // Get billable hours
    const timesheetEntries = await WorkTimesheet.findAll({
        where: {
            userId,
            startedAt: { [Op.gte]: monthStart, [Op.lte]: monthEnd },
            isBillable: true,
        },
        include: [
            {
                model: WorkProject,
                as: 'project',
                include: [{ model: WorkClient, as: 'client' }],
            },
        ],
    });

    let totalBillableSeconds = 0;
    const hoursByClient = {};

    for (const entry of timesheetEntries) {
        const start = new Date(entry.startedAt);
        const end = entry.endedAt ? new Date(entry.endedAt) : new Date();
        const seconds = (end - start) / 1000;
        totalBillableSeconds += seconds;

        const clientId = entry.project?.clientId || 'no_client';
        const clientName = entry.project?.client?.name || 'Sem cliente';
        const hourlyRate = entry.project?.client?.hourlyRate || entry.hourlyRate || 0;

        if (!hoursByClient[clientId]) {
            hoursByClient[clientId] = {
                clientId: entry.project?.clientId,
                clientName,
                hours: 0,
                hourlyRate,
                value: 0,
            };
        }
        const hours = seconds / 3600;
        hoursByClient[clientId].hours += hours;
        hoursByClient[clientId].value += hours * hourlyRate;
    }

    const totalBillableHours = totalBillableSeconds / 3600;

    // Get invoices for the period
    const invoices = await WorkInvoice.findAll({
        where: {
            userId,
            periodStart: { [Op.lte]: monthEnd },
            periodEnd: { [Op.gte]: monthStart },
        },
    });

    let totalInvoiced = 0;
    let totalReceived = 0;
    let totalPending = 0;

    for (const invoice of invoices) {
        totalInvoiced += invoice.totalValue || 0;
        if (invoice.paidAt) {
            totalReceived += invoice.totalValue || 0;
        } else {
            totalPending += invoice.totalValue || 0;
        }
    }

    // Calculate total value from hours
    const totalValue = Object.values(hoursByClient).reduce((sum, c) => sum + c.value, 0);

    // Average hourly rate
    const avgHourlyRate = totalBillableHours > 0 ? totalValue / totalBillableHours : 0;

    // Client ranking
    const clientRanking = Object.values(hoursByClient)
        .map(c => ({
            ...c,
            hours: Math.round(c.hours * 10) / 10,
            value: Math.round(c.value * 100) / 100,
            percentage: totalValue > 0 ? Math.round((c.value / totalValue) * 100) : 0,
        }))
        .sort((a, b) => b.value - a.value);

    return {
        period: {
            month,
            year,
            label: new Date(year, month - 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        },
        summary: {
            billableHours: Math.round(totalBillableHours * 10) / 10,
            totalValue: Math.round(totalValue * 100) / 100,
            totalInvoiced: Math.round(totalInvoiced * 100) / 100,
            totalReceived: Math.round(totalReceived * 100) / 100,
            totalPending: Math.round(totalPending * 100) / 100,
            avgHourlyRate: Math.round(avgHourlyRate * 100) / 100,
        },
        clients: clientRanking,
    };
};

const getBillingTrends = async (userId, months = 6) => {
    const trends = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        try {
            const report = await generateBillingReport(userId, month, year);
            trends.push({
                month,
                year,
                label: date.toLocaleDateString('pt-BR', { month: 'short' }),
                value: report.summary.totalValue,
                hours: report.summary.billableHours,
            });
        } catch (e) {
            trends.push({
                month,
                year,
                label: date.toLocaleDateString('pt-BR', { month: 'short' }),
                value: 0,
                hours: 0,
            });
        }
    }

    return trends;
};

// ==================== ENDPOINTS ====================

const getWeeklyReport = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { weekStart } = request.query;

        const { WorkProfile } = require('../models');
        const profile = await WorkProfile.findOne({ where: { userId } });

        const targetWeekStart = weekStart
            ? new Date(weekStart)
            : getStartOfWeek(new Date(), profile?.weekStartDay || 1);

        const report = await generateWeeklyReport(userId, targetWeekStart);
        return reply.send(report);
    } catch (error) {
        console.error('Error generating weekly report:', error);
        return reply.status(500).send({ error: 'Failed to generate weekly report' });
    }
};

const getMonthlyReport = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { month, year } = request.query;

        const today = new Date();
        const targetMonth = month ? parseInt(month) : today.getMonth() + 1;
        const targetYear = year ? parseInt(year) : today.getFullYear();

        const report = await generateMonthlyReport(userId, targetMonth, targetYear);
        return reply.send(report);
    } catch (error) {
        console.error('Error generating monthly report:', error);
        return reply.status(500).send({ error: 'Failed to generate monthly report' });
    }
};

const getBillingReport = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { month, year, trendMonths } = request.query;

        const today = new Date();
        const targetMonth = month ? parseInt(month) : today.getMonth() + 1;
        const targetYear = year ? parseInt(year) : today.getFullYear();

        const [report, trends] = await Promise.all([
            generateBillingReport(userId, targetMonth, targetYear),
            getBillingTrends(userId, parseInt(trendMonths) || 6),
        ]);

        // Compare with previous month
        const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
        const prevYear = targetMonth === 1 ? targetYear - 1 : targetYear;
        const prevReport = await generateBillingReport(userId, prevMonth, prevYear);

        const comparison = {
            valueDiff: report.summary.totalValue - prevReport.summary.totalValue,
            valueDiffPercentage: prevReport.summary.totalValue > 0
                ? Math.round(((report.summary.totalValue - prevReport.summary.totalValue) / prevReport.summary.totalValue) * 100)
                : 0,
            direction: report.summary.totalValue > prevReport.summary.totalValue ? 'up' : 'down',
        };

        return reply.send({
            ...report,
            comparison,
            trends,
        });
    } catch (error) {
        console.error('Error generating billing report:', error);
        return reply.status(500).send({ error: 'Failed to generate billing report' });
    }
};

module.exports = {
    calculateWeeklyMetrics,
    compareWithPreviousWeek,
    generateWeeklyInsights,
    generateWeeklyReport,
    calculateMonthlyMetrics,
    getWeeklyTrends,
    generateMonthlyReport,
    generateBillingReport,
    getBillingTrends,
    getWeeklyReport,
    getMonthlyReport,
    getBillingReport,
};

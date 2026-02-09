const DashboardSettings = require('../models/DashboardSettings');
const DashboardQuickStat = require('../models/DashboardQuickStat');
const DashboardWidget = require('../models/DashboardWidget');
const DashboardAlertSetting = require('../models/DashboardAlertSetting');

// Default quick stats configuration
const DEFAULT_QUICK_STATS = [
    { statType: 'HABITS', displayOrder: 0, isActive: true },
    { statType: 'TASKS', displayOrder: 1, isActive: true },
    { statType: 'WORK', displayOrder: 2, isActive: true },
    { statType: 'RECOVERY', displayOrder: 3, isActive: true },
];

// Default widgets configuration
const DEFAULT_WIDGETS = [
    { widgetType: 'HABITS_TODAY', displayOrder: 0, columnPosition: 0, isActive: true },
    { widgetType: 'TASKS_TODAY', displayOrder: 1, columnPosition: 1, isActive: true },
    { widgetType: 'WORK', displayOrder: 2, columnPosition: 0, isActive: true },
    { widgetType: 'UPCOMING_EVENTS', displayOrder: 3, columnPosition: 1, isActive: true },
    { widgetType: 'FINANCIAL_SUMMARY', displayOrder: 4, columnPosition: 0, isActive: false },
    { widgetType: 'MODULE_SCORES', displayOrder: 5, columnPosition: 1, isActive: false },
];

// Default alert settings configuration
const DEFAULT_ALERT_SETTINGS = [
    { alertType: 'STREAK_RISK', isActive: true, daysBefore: 0 },
    { alertType: 'OVERDUE_TASKS', isActive: true, daysBefore: 0 },
    { alertType: 'UPCOMING_BILLS', isActive: true, daysBefore: 3 },
    { alertType: 'BIRTHDAYS', isActive: true, daysBefore: 3 },
    { alertType: 'HIGH_STRAIN', isActive: true, daysBefore: 0 },
    { alertType: 'MEDICATIONS', isActive: true, daysBefore: 0 },
    { alertType: 'DEADLINES', isActive: true, daysBefore: 3 },
];

// ==================== SETTINGS ====================

const getSettings = async (request, reply) => {
    try {
        const { userId } = request.params;

        let settings = await DashboardSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await DashboardSettings.create({ userId });
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error getting dashboard settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const updateSettings = async (request, reply) => {
    try {
        const { userId } = request.params;
        const updateData = request.body;

        let settings = await DashboardSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await DashboardSettings.create({ userId, ...updateData });
        } else {
            await settings.update(updateData);
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating dashboard settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== QUICK STATS ====================

const getQuickStats = async (request, reply) => {
    try {
        const { userId } = request.params;

        let quickStats = await DashboardQuickStat.findAll({
            where: { userId },
            order: [['displayOrder', 'ASC']],
        });

        // Create defaults if none exist (ignoreDuplicates handles race conditions)
        if (quickStats.length === 0) {
            const statsToCreate = DEFAULT_QUICK_STATS.map((stat) => ({
                userId,
                ...stat,
            }));
            await DashboardQuickStat.bulkCreate(statsToCreate, { ignoreDuplicates: true });
            quickStats = await DashboardQuickStat.findAll({
                where: { userId },
                order: [['displayOrder', 'ASC']],
            });
        }

        return reply.send({ success: true, data: quickStats });
    } catch (error) {
        console.error('Error getting quick stats:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const updateQuickStats = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { stats } = request.body;

        // Delete existing and recreate
        await DashboardQuickStat.destroy({ where: { userId } });

        const quickStats = await DashboardQuickStat.bulkCreate(
            stats.map((stat, index) => ({
                userId,
                statType: stat.statType,
                isActive: stat.isActive,
                displayOrder: stat.displayOrder ?? index,
            }))
        );

        return reply.send({ success: true, data: quickStats });
    } catch (error) {
        console.error('Error updating quick stats:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== WIDGETS ====================

const getWidgets = async (request, reply) => {
    try {
        const { userId } = request.params;

        let widgets = await DashboardWidget.findAll({
            where: { userId },
            order: [['displayOrder', 'ASC']],
        });

        // Create defaults if none exist (ignoreDuplicates handles race conditions)
        if (widgets.length === 0) {
            const widgetsToCreate = DEFAULT_WIDGETS.map((widget) => ({
                userId,
                ...widget,
            }));
            await DashboardWidget.bulkCreate(widgetsToCreate, { ignoreDuplicates: true });
            widgets = await DashboardWidget.findAll({
                where: { userId },
                order: [['displayOrder', 'ASC']],
            });
        }

        return reply.send({ success: true, data: widgets });
    } catch (error) {
        console.error('Error getting widgets:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const updateWidgets = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { widgets } = request.body;

        // Delete existing and recreate
        await DashboardWidget.destroy({ where: { userId } });

        const createdWidgets = await DashboardWidget.bulkCreate(
            widgets.map((widget, index) => ({
                userId,
                widgetType: widget.widgetType,
                isActive: widget.isActive,
                displayOrder: widget.displayOrder ?? index,
                columnPosition: widget.columnPosition ?? 0,
            }))
        );

        return reply.send({ success: true, data: createdWidgets });
    } catch (error) {
        console.error('Error updating widgets:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== ALERT SETTINGS ====================

const getAlertSettings = async (request, reply) => {
    try {
        const { userId } = request.params;

        let alertSettings = await DashboardAlertSetting.findAll({
            where: { userId },
        });

        // Create defaults if none exist (ignoreDuplicates handles race conditions)
        if (alertSettings.length === 0) {
            const settingsToCreate = DEFAULT_ALERT_SETTINGS.map((setting) => ({
                userId,
                ...setting,
            }));
            await DashboardAlertSetting.bulkCreate(settingsToCreate, { ignoreDuplicates: true });
            alertSettings = await DashboardAlertSetting.findAll({
                where: { userId },
            });
        }

        return reply.send({ success: true, data: alertSettings });
    } catch (error) {
        console.error('Error getting alert settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const updateAlertSettings = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { settings } = request.body;

        // Delete existing and recreate
        await DashboardAlertSetting.destroy({ where: { userId } });

        const alertSettings = await DashboardAlertSetting.bulkCreate(
            settings.map((setting) => ({
                userId,
                alertType: setting.alertType,
                isActive: setting.isActive,
                daysBefore: setting.daysBefore ?? 3,
            }))
        );

        return reply.send({ success: true, data: alertSettings });
    } catch (error) {
        console.error('Error updating alert settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== ALERTS DATA ====================

const getAlerts = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Get user's alert settings
        const alertSettings = await DashboardAlertSetting.findAll({
            where: { userId, isActive: true },
        });

        const alerts = [];

        // TODO: Implement actual alert gathering from various modules
        // For now, returning empty structure - each module integration would add alerts

        // Example alert structure:
        // alerts.push({
        //     type: 'STREAK_RISK',
        //     priority: 'urgent',
        //     title: 'Streak em risco!',
        //     description: 'Meditação - 7 dias consecutivos',
        //     actionLabel: 'Ir para Hábitos',
        //     actionUrl: '/habits',
        //     data: { habitId: '...' }
        // });

        return reply.send({
            success: true,
            data: {
                count: alerts.length,
                alerts,
            },
        });
    } catch (error) {
        console.error('Error getting alerts:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== QUICK STATS DATA ====================

const getQuickStatsData = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Get user's quick stats configuration
        const quickStats = await DashboardQuickStat.findAll({
            where: { userId, isActive: true },
            order: [['displayOrder', 'ASC']],
        });

        const statsData = [];

        // TODO: Implement actual stat gathering from various modules
        // For now, returning mock structure

        for (const stat of quickStats) {
            const statData = {
                type: stat.statType,
                label: getStatLabel(stat.statType),
                value: null,
                subtext: null,
                status: 'neutral',
                link: getStatLink(stat.statType),
            };

            // Each module would populate its data here
            statsData.push(statData);
        }

        return reply.send({ success: true, data: statsData });
    } catch (error) {
        console.error('Error getting quick stats data:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== DASHBOARD OVERVIEW ====================

const getDashboardOverview = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Get all dashboard configurations
        const [settings, quickStats, widgets, alertSettings] = await Promise.all([
            DashboardSettings.findOne({ where: { userId } }),
            DashboardQuickStat.findAll({ where: { userId }, order: [['displayOrder', 'ASC']] }),
            DashboardWidget.findAll({ where: { userId }, order: [['displayOrder', 'ASC']] }),
            DashboardAlertSetting.findAll({ where: { userId } }),
        ]);

        // Create defaults if needed (ignoreDuplicates handles race conditions with parallel requests)
        const finalSettings = settings || await DashboardSettings.findOrCreate({ where: { userId }, defaults: { userId } }).then(([s]) => s);

        let finalQuickStats = quickStats;
        if (quickStats.length === 0) {
            await DashboardQuickStat.bulkCreate(DEFAULT_QUICK_STATS.map((s) => ({ userId, ...s })), { ignoreDuplicates: true });
            finalQuickStats = await DashboardQuickStat.findAll({ where: { userId }, order: [['displayOrder', 'ASC']] });
        }

        let finalWidgets = widgets;
        if (widgets.length === 0) {
            await DashboardWidget.bulkCreate(DEFAULT_WIDGETS.map((w) => ({ userId, ...w })), { ignoreDuplicates: true });
            finalWidgets = await DashboardWidget.findAll({ where: { userId }, order: [['displayOrder', 'ASC']] });
        }

        let finalAlertSettings = alertSettings;
        if (alertSettings.length === 0) {
            await DashboardAlertSetting.bulkCreate(DEFAULT_ALERT_SETTINGS.map((a) => ({ userId, ...a })), { ignoreDuplicates: true });
            finalAlertSettings = await DashboardAlertSetting.findAll({ where: { userId } });
        }

        // Get greeting data
        const hour = new Date().getHours();
        let greeting;
        if (hour < 12) greeting = 'Bom dia';
        else if (hour < 18) greeting = 'Boa tarde';
        else greeting = 'Boa noite';

        return reply.send({
            success: true,
            data: {
                greeting,
                settings: finalSettings,
                quickStats: finalQuickStats,
                widgets: finalWidgets,
                alertSettings: finalAlertSettings,
            },
        });
    } catch (error) {
        console.error('Error getting dashboard overview:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Helper functions
function getStatLabel(statType) {
    const labels = {
        HABITS: 'Hábitos',
        TASKS: 'Tarefas',
        WORK: 'Trabalho',
        RECOVERY: 'Recovery',
        BALANCE: 'Saldo',
        CALORIES: 'Calorias',
        STUDY_TIME: 'Estudo',
        HOME_TASKS: 'Casa',
        SOCIAL_BATTERY: 'Social',
    };
    return labels[statType] || statType;
}

function getStatLink(statType) {
    const links = {
        HABITS: '/habits',
        TASKS: '/tasks',
        WORK: '/work',
        RECOVERY: '/work',
        BALANCE: '/finance',
        CALORIES: '/health',
        STUDY_TIME: '/study',
        HOME_TASKS: '/home-module',
        SOCIAL_BATTERY: '/social',
    };
    return links[statType] || '/';
}

module.exports = {
    getSettings,
    updateSettings,
    getQuickStats,
    updateQuickStats,
    getWidgets,
    updateWidgets,
    getAlertSettings,
    updateAlertSettings,
    getAlerts,
    getQuickStatsData,
    getDashboardOverview,
};

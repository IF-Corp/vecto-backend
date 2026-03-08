const DashboardSettings = require('../models/DashboardSettings');
const DashboardQuickStat = require('../models/DashboardQuickStat');
const DashboardWidget = require('../models/DashboardWidget');
const DashboardAlertSetting = require('../models/DashboardAlertSetting');
const { Op } = require('sequelize');
const {
    Transaction,
    Budget,
    Habit,
    HabitLog,
    Task,
    WorkTask,
    SleepMetric,
    MealLog,
    StudyFocusSession,
    HomeTask,
    HomeTaskOccurrence,
    HomeSpace,
    SocialBatteryLog,
    Medication,
    MedicationLog,
    CalendarEvent,
    WorkMeeting,
    SocialEvent,
} = require('../models');

// Turn Calendar type config
const TURN_CALENDAR_TYPE_CONFIG = {
    habit: { color: '#8B5CF6', icon: 'Target' },
    task: { color: '#3B82F6', icon: 'CheckSquare' },
    meeting: { color: '#6366F1', icon: 'Briefcase' },
    medication: { color: '#06B6D4', icon: 'Pill' },
    study_session: { color: '#F59E0B', icon: 'BookOpen' },
    event: { color: '#10B981', icon: 'Calendar' },
    home_task: { color: '#F97316', icon: 'Home' },
    social: { color: '#EC4899', icon: 'Users' },
};

// Map time period strings to hour values
function timePeriodToHour(period, turnStartHour) {
    const map = { morning: 7, afternoon: 13, evening: 19 };
    return map[period] ?? turnStartHour + 1;
}

// Build an ISO datetime string from a date string and a TIME value (HH:MM:SS or HH:MM)
function buildDateTime(dateStr, timeValue) {
    if (!timeValue) return null;
    const timePart = String(timeValue).substring(0, 5); // HH:MM
    return new Date(`${dateStr}T${timePart}:00`);
}

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
            })),
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
            })),
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
            })),
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

        const quickStats = await DashboardQuickStat.findAll({
            where: { userId, isActive: true },
            order: [['displayOrder', 'ASC']],
        });

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ...
        const year = today.getFullYear();
        const month = today.getMonth();
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

        // Gather stat types needed to avoid unnecessary queries
        const neededTypes = new Set(quickStats.map((s) => s.statType));

        // Parallel data fetching for needed modules
        const [
            habits,
            habitLogs,
            tasks,
            transactions,
            budgets,
            workTasks,
            lastSleep,
            todayMeals,
            todayStudySessions,
            homeSpaces,
            socialBattery,
        ] = await Promise.all([
            neededTypes.has('HABITS')
                ? Habit.findAll({ where: { user_id: userId, status: 'active' } })
                : [],
            neededTypes.has('HABITS')
                ? HabitLog.findAll({
                      where: { execution_date: todayStr },
                      include: [
                          {
                              model: Habit,
                              as: 'habit',
                              where: { user_id: userId },
                              attributes: ['id'],
                          },
                      ],
                  })
                : [],
            neededTypes.has('TASKS')
                ? Task.findAll({ where: { user_id: userId, status: { [Op.ne]: 'DONE' } } })
                : [],
            neededTypes.has('BALANCE')
                ? Transaction.findAll({
                      where: {
                          user_id: userId,
                          transaction_date: { [Op.between]: [startOfMonth, endOfMonth] },
                      },
                  })
                : [],
            neededTypes.has('BALANCE')
                ? Budget.findAll({ where: { user_id: userId, is_active: true } })
                : [],
            neededTypes.has('WORK')
                ? WorkTask.findAll({ where: { user_id: userId, completed_at: null } })
                : [],
            neededTypes.has('RECOVERY')
                ? SleepMetric.findOne({
                      where: { user_id: userId },
                      order: [['sleep_date', 'DESC']],
                  })
                : null,
            neededTypes.has('CALORIES')
                ? MealLog.findAll({
                      where: {
                          user_id: userId,
                          meal_date: {
                              [Op.between]: [new Date(todayStr), new Date(todayStr + 'T23:59:59')],
                          },
                      },
                  })
                : [],
            neededTypes.has('STUDY_TIME')
                ? StudyFocusSession.findAll({
                      where: {
                          user_id: userId,
                          started_at: { [Op.gte]: new Date(todayStr) },
                          status: { [Op.in]: ['COMPLETED', 'IN_PROGRESS'] },
                      },
                  })
                : [],
            neededTypes.has('HOME_TASKS')
                ? HomeSpace.findAll({
                      where: { user_id: userId, is_active: true },
                      attributes: ['id'],
                  })
                : [],
            neededTypes.has('SOCIAL_BATTERY')
                ? SocialBatteryLog.findOne({
                      where: { user_id: userId },
                      order: [['date', 'DESC']],
                  })
                : null,
        ]);

        // Pre-compute stats
        let habitsTotal = 0,
            habitsDone = 0;
        if (neededTypes.has('HABITS')) {
            const todayHabits = habits.filter((h) => {
                if (h.frequency === 'DAILY') return true;
                if (h.frequency === 'WEEKLY' || h.frequency === 'CUSTOM') {
                    const days = h.frequency_days || [];
                    return days.includes(dayOfWeek);
                }
                return false;
            });
            habitsTotal = todayHabits.length;
            habitsDone = habitLogs.filter((l) => l.status === 'DONE').length;
        }

        let pendingTasks = 0,
            overdueTasks = 0;
        if (neededTypes.has('TASKS')) {
            pendingTasks = tasks.length;
            overdueTasks = tasks.filter(
                (t) => t.scheduled_date && t.scheduled_date < todayStr,
            ).length;
        }

        let totalIncome = 0,
            totalExpenses = 0;
        if (neededTypes.has('BALANCE')) {
            totalIncome = transactions
                .filter((t) => t.type === 'INCOME')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
            totalExpenses = transactions
                .filter((t) => t.type === 'EXPENSE')
                .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        }

        // Work stats
        let pendingWorkTasks = 0,
            urgentWorkTasks = 0;
        if (neededTypes.has('WORK')) {
            pendingWorkTasks = workTasks.length;
            urgentWorkTasks = workTasks.filter((t) => t.is_urgent).length;
        }

        // Calories stats
        let totalCalories = 0,
            mealCount = 0;
        if (neededTypes.has('CALORIES')) {
            totalCalories = todayMeals.reduce((sum, m) => sum + (parseInt(m.calories) || 0), 0);
            mealCount = todayMeals.length;
        }

        // Study time stats
        let totalStudyMinutes = 0,
            studySessionCount = 0;
        if (neededTypes.has('STUDY_TIME')) {
            totalStudyMinutes = todayStudySessions.reduce(
                (sum, s) => sum + (s.total_focus_minutes || 0),
                0,
            );
            studySessionCount = todayStudySessions.length;
        }

        // Home tasks stats
        let pendingHomeTasks = 0,
            overdueHomeTasks = 0;
        if (neededTypes.has('HOME_TASKS') && homeSpaces.length > 0) {
            const spaceIds = homeSpaces.map((s) => s.id);
            const homeTasks = await HomeTask.findAll({
                where: { space_id: { [Op.in]: spaceIds }, is_active: true },
                attributes: ['id'],
            });
            if (homeTasks.length > 0) {
                const taskIds = homeTasks.map((t) => t.id);
                const pendingOccurrences = await HomeTaskOccurrence.findAll({
                    where: {
                        task_id: { [Op.in]: taskIds },
                        status: 'PENDING',
                        due_date: { [Op.lte]: todayStr },
                    },
                });
                pendingHomeTasks = pendingOccurrences.length;
                overdueHomeTasks = pendingOccurrences.filter((o) => o.due_date < todayStr).length;
            }
        }

        const statsData = quickStats.map((stat) => {
            const base = {
                type: stat.statType,
                label: getStatLabel(stat.statType),
                value: null,
                subtext: null,
                status: 'neutral',
                link: getStatLink(stat.statType),
            };

            switch (stat.statType) {
                case 'HABITS': {
                    const pct = habitsTotal > 0 ? Math.round((habitsDone / habitsTotal) * 100) : 0;
                    base.value = `${habitsDone}/${habitsTotal}`;
                    base.subtext = habitsTotal > 0 ? `${pct}% concluído` : 'Nenhum hábito hoje';
                    base.status =
                        habitsTotal === 0
                            ? 'neutral'
                            : pct >= 80
                              ? 'good'
                              : pct >= 50
                                ? 'warning'
                                : 'bad';
                    break;
                }
                case 'TASKS': {
                    base.value = pendingTasks.toString();
                    base.subtext =
                        overdueTasks > 0
                            ? `${overdueTasks} atrasada${overdueTasks > 1 ? 's' : ''}`
                            : 'Nenhuma atrasada';
                    base.status = overdueTasks > 0 ? 'bad' : pendingTasks > 0 ? 'warning' : 'good';
                    break;
                }
                case 'BALANCE': {
                    const balance = totalIncome - totalExpenses;
                    const fmt = (v) =>
                        v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    base.value = fmt(balance);
                    base.subtext = `Receitas: ${fmt(totalIncome)}`;
                    base.status = balance > 0 ? 'good' : balance === 0 ? 'neutral' : 'bad';
                    break;
                }
                case 'WORK': {
                    base.value = pendingWorkTasks.toString();
                    base.subtext =
                        urgentWorkTasks > 0
                            ? `${urgentWorkTasks} urgente${urgentWorkTasks > 1 ? 's' : ''}`
                            : 'Nenhuma urgente';
                    base.status =
                        urgentWorkTasks > 0 ? 'bad' : pendingWorkTasks > 5 ? 'warning' : 'good';
                    break;
                }
                case 'RECOVERY': {
                    if (lastSleep && lastSleep.duration_minutes) {
                        const hours = Math.floor(lastSleep.duration_minutes / 60);
                        const mins = lastSleep.duration_minutes % 60;
                        base.value =
                            mins > 0 ? `${hours}h${mins.toString().padStart(2, '0')}` : `${hours}h`;
                        const quality = lastSleep.quality_rating;
                        const qualityLabels = {
                            1: 'Péssima',
                            2: 'Ruim',
                            3: 'Regular',
                            4: 'Boa',
                            5: 'Ótima',
                        };
                        base.subtext = quality
                            ? `Qualidade: ${qualityLabels[quality] || quality}`
                            : lastSleep.sleep_date;
                        base.status =
                            lastSleep.duration_minutes >= 420
                                ? 'good'
                                : lastSleep.duration_minutes >= 300
                                  ? 'warning'
                                  : 'bad';
                    } else {
                        base.value = '—';
                        base.subtext = 'Nenhum registro de sono';
                        base.status = 'neutral';
                    }
                    break;
                }
                case 'CALORIES': {
                    if (mealCount > 0) {
                        base.value = `${totalCalories} kcal`;
                        base.subtext = `${mealCount} refeição${mealCount > 1 ? 'ões' : ''} registrada${mealCount > 1 ? 's' : ''}`;
                        base.status = mealCount >= 3 ? 'good' : 'warning';
                    } else {
                        base.value = '0 kcal';
                        base.subtext = 'Nenhuma refeição hoje';
                        base.status = 'neutral';
                    }
                    break;
                }
                case 'STUDY_TIME': {
                    if (totalStudyMinutes > 0) {
                        const h = Math.floor(totalStudyMinutes / 60);
                        const m = totalStudyMinutes % 60;
                        base.value =
                            h > 0
                                ? m > 0
                                    ? `${h}h${m.toString().padStart(2, '0')}`
                                    : `${h}h`
                                : `${m}min`;
                        base.subtext = `${studySessionCount} sessão${studySessionCount > 1 ? 'ões' : ''} hoje`;
                        base.status = totalStudyMinutes >= 60 ? 'good' : 'warning';
                    } else {
                        base.value = '0min';
                        base.subtext = 'Nenhuma sessão hoje';
                        base.status = 'neutral';
                    }
                    break;
                }
                case 'HOME_TASKS': {
                    base.value = pendingHomeTasks.toString();
                    base.subtext =
                        overdueHomeTasks > 0
                            ? `${overdueHomeTasks} atrasada${overdueHomeTasks > 1 ? 's' : ''}`
                            : 'Nenhuma atrasada';
                    base.status =
                        overdueHomeTasks > 0 ? 'bad' : pendingHomeTasks > 0 ? 'warning' : 'good';
                    break;
                }
                case 'SOCIAL_BATTERY': {
                    if (socialBattery) {
                        const level = socialBattery.battery_level;
                        base.value = `${level}%`;
                        base.subtext =
                            level >= 70
                                ? 'Energia social alta'
                                : level >= 40
                                  ? 'Energia moderada'
                                  : 'Energia baixa';
                        base.status = level >= 70 ? 'good' : level >= 40 ? 'warning' : 'bad';
                    } else {
                        base.value = '—';
                        base.subtext = 'Nenhum registro';
                        base.status = 'neutral';
                    }
                    break;
                }
                default:
                    break;
            }

            return base;
        });

        return reply.send({ success: true, data: statsData });
    } catch (error) {
        request.log.error(error, 'Error getting quick stats data');
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
        const finalSettings =
            settings ||
            (await DashboardSettings.findOrCreate({ where: { userId }, defaults: { userId } }).then(
                ([s]) => s,
            ));

        let finalQuickStats = quickStats;
        if (quickStats.length === 0) {
            await DashboardQuickStat.bulkCreate(
                DEFAULT_QUICK_STATS.map((s) => ({ userId, ...s })),
                { ignoreDuplicates: true },
            );
            finalQuickStats = await DashboardQuickStat.findAll({
                where: { userId },
                order: [['displayOrder', 'ASC']],
            });
        }

        let finalWidgets = widgets;
        if (widgets.length === 0) {
            await DashboardWidget.bulkCreate(
                DEFAULT_WIDGETS.map((w) => ({ userId, ...w })),
                { ignoreDuplicates: true },
            );
            finalWidgets = await DashboardWidget.findAll({
                where: { userId },
                order: [['displayOrder', 'ASC']],
            });
        }

        let finalAlertSettings = alertSettings;
        if (alertSettings.length === 0) {
            await DashboardAlertSetting.bulkCreate(
                DEFAULT_ALERT_SETTINGS.map((a) => ({ userId, ...a })),
                { ignoreDuplicates: true },
            );
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

// ==================== TURN CALENDAR ====================

const getTurnCalendar = async (request, reply) => {
    try {
        const { userId } = request.params;
        const hours = parseInt(request.query.hours) || 8;

        // Step 1: Get user settings for turn window config
        const settings = await DashboardSettings.findOne({ where: { userId } });
        const turnStartHour = settings?.turnStartHour ?? 7;

        // Step 2: Calculate turn window
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...6=Sat
        const dayStart = new Date(`${todayStr}T00:00:00`);
        const dayEnd = new Date(`${todayStr}T23:59:59`);
        const turnStart = new Date(`${todayStr}T${String(turnStartHour).padStart(2, '0')}:00:00`);
        const turnEnd = new Date(turnStart.getTime() + hours * 60 * 60 * 1000);

        // Step 3: Parallel queries
        const [
            habits,
            habitLogs,
            tasks,
            meetings,
            medications,
            medicationLogs,
            studySessions,
            calendarEvents,
            homeOccurrences,
            socialEvents,
        ] = await Promise.all([
            // 1. Active habits scheduled for today
            Habit.findAll({
                where: { user_id: userId, status: 'active', is_frozen: false },
            }),
            // 2. Today's habit logs
            HabitLog.findAll({
                where: { execution_date: todayStr },
                include: [
                    {
                        model: Habit,
                        as: 'habit',
                        where: { user_id: userId },
                        attributes: ['id'],
                    },
                ],
            }),
            // 3. Tasks scheduled for today
            Task.findAll({
                where: { user_id: userId, scheduled_date: todayStr },
            }),
            // 4. Work meetings today
            WorkMeeting.findAll({
                where: {
                    user_id: userId,
                    start_time: { [Op.between]: [dayStart, dayEnd] },
                },
            }),
            // 5. Active medications
            Medication.findAll({
                where: {
                    user_id: userId,
                    is_active: true,
                    start_date: { [Op.lte]: todayStr },
                    [Op.or]: [{ end_date: null }, { end_date: { [Op.gte]: todayStr } }],
                },
            }),
            // 6. Today's medication logs
            MedicationLog.findAll({
                where: {
                    taken_at: { [Op.between]: [dayStart, dayEnd] },
                },
                include: [
                    {
                        model: Medication,
                        as: 'medication',
                        where: { user_id: userId },
                        attributes: ['id'],
                    },
                ],
            }),
            // 7. Today's study sessions
            StudyFocusSession.findAll({
                where: {
                    user_id: userId,
                    started_at: { [Op.gte]: dayStart },
                    status: { [Op.in]: ['COMPLETED', 'IN_PROGRESS'] },
                },
            }),
            // 8. Today's calendar events (non-all-day)
            CalendarEvent.findAll({
                where: {
                    user_id: userId,
                    start_date: { [Op.between]: [dayStart, dayEnd] },
                    is_all_day: false,
                },
            }),
            // 9. Today's home task occurrences
            HomeTaskOccurrence.findAll({
                where: { due_date: todayStr },
                include: [
                    {
                        model: HomeTask,
                        as: 'task',
                        where: { is_active: true },
                        include: [
                            {
                                model: HomeSpace,
                                as: 'space',
                                where: { user_id: userId },
                                attributes: ['id'],
                            },
                        ],
                    },
                ],
            }),
            // 10. Today's social events
            SocialEvent.findAll({
                where: {
                    user_id: userId,
                    event_date: todayStr,
                    status: { [Op.ne]: 'CANCELLED' },
                },
            }),
        ]);

        // Step 4: Map to TurnCalendarItem format
        const items = [];

        // -- Habits --
        const habitLogMap = new Set(
            habitLogs.filter((l) => l.status === 'DONE').map((l) => l.habit_id),
        );
        const todayHabits = habits.filter((h) => {
            if (h.frequency === 'DAILY') return true;
            if (h.frequency === 'WEEKLY' || h.frequency === 'CUSTOM') {
                const days = h.frequency_days || [];
                return days.includes(dayOfWeek);
            }
            return false;
        });
        for (const h of todayHabits) {
            let startDate;
            if (h.ideal_time) {
                startDate = buildDateTime(todayStr, h.ideal_time);
            } else {
                const hour = timePeriodToHour(h.time_period, turnStartHour);
                startDate = new Date(`${todayStr}T${String(hour).padStart(2, '0')}:00:00`);
            }
            const duration = h.estimated_duration || 30;
            items.push({
                id: h.id,
                type: 'habit',
                title: h.name,
                startTime: startDate.toISOString(),
                endTime: new Date(startDate.getTime() + duration * 60 * 1000).toISOString(),
                durationMinutes: duration,
                moduleColor: TURN_CALENDAR_TYPE_CONFIG.habit.color,
                moduleIcon: TURN_CALENDAR_TYPE_CONFIG.habit.icon,
                isCompleted: habitLogMap.has(h.id),
                link: `/habits`,
            });
        }

        // -- Tasks --
        for (const t of tasks) {
            let startDate;
            if (t.scheduled_time) {
                startDate = buildDateTime(todayStr, t.scheduled_time);
            } else {
                startDate = new Date(`${todayStr}T${String(turnStartHour).padStart(2, '0')}:00:00`);
            }
            const duration = t.estimated_duration || 30;
            items.push({
                id: t.id,
                type: 'task',
                title: t.name,
                startTime: startDate.toISOString(),
                endTime: new Date(startDate.getTime() + duration * 60 * 1000).toISOString(),
                durationMinutes: duration,
                moduleColor: TURN_CALENDAR_TYPE_CONFIG.task.color,
                moduleIcon: TURN_CALENDAR_TYPE_CONFIG.task.icon,
                isCompleted: t.status === 'DONE',
                link: `/tasks`,
            });
        }

        // -- Work Meetings --
        for (const m of meetings) {
            const startDate = new Date(m.start_time);
            const duration = m.duration_minutes || 60;
            items.push({
                id: m.id,
                type: 'meeting',
                title: m.title,
                startTime: startDate.toISOString(),
                endTime: new Date(startDate.getTime() + duration * 60 * 1000).toISOString(),
                durationMinutes: duration,
                moduleColor: TURN_CALENDAR_TYPE_CONFIG.meeting.color,
                moduleIcon: TURN_CALENDAR_TYPE_CONFIG.meeting.icon,
                isCompleted: false,
                link: `/work`,
            });
        }

        // -- Medications (one item per scheduled time) --
        const medLogMap = {};
        for (const log of medicationLogs) {
            if (log.status === 'TAKEN') {
                if (!medLogMap[log.medication_id]) medLogMap[log.medication_id] = [];
                medLogMap[log.medication_id].push(log);
            }
        }
        for (const med of medications) {
            const times = med.time_of_day || [];
            for (const time of times) {
                const startDate = buildDateTime(todayStr, time);
                if (!startDate) continue;
                const takenLogs = medLogMap[med.id] || [];
                const isTaken = takenLogs.length > 0;
                items.push({
                    id: `${med.id}-${time}`,
                    type: 'medication',
                    title: `${med.name}${med.dosage ? ` (${med.dosage})` : ''}`,
                    startTime: startDate.toISOString(),
                    endTime: new Date(startDate.getTime() + 5 * 60 * 1000).toISOString(),
                    durationMinutes: 5,
                    moduleColor: TURN_CALENDAR_TYPE_CONFIG.medication.color,
                    moduleIcon: TURN_CALENDAR_TYPE_CONFIG.medication.icon,
                    isCompleted: isTaken,
                    link: `/health`,
                });
            }
        }

        // -- Study Sessions --
        for (const s of studySessions) {
            const startDate = new Date(s.started_at);
            const duration = s.total_focus_minutes + s.total_break_minutes || 30;
            const endDate = s.finished_at
                ? new Date(s.finished_at)
                : new Date(startDate.getTime() + duration * 60 * 1000);
            items.push({
                id: s.id,
                type: 'study_session',
                title: 'Sessão de Estudo',
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                durationMinutes: duration,
                moduleColor: TURN_CALENDAR_TYPE_CONFIG.study_session.color,
                moduleIcon: TURN_CALENDAR_TYPE_CONFIG.study_session.icon,
                isCompleted: s.status === 'COMPLETED',
                link: `/study`,
            });
        }

        // -- Calendar Events --
        for (const e of calendarEvents) {
            const startDate = new Date(e.start_date);
            let endDate;
            let duration;
            if (e.end_date) {
                endDate = new Date(e.end_date);
                duration = Math.round((endDate - startDate) / (60 * 1000));
            } else {
                duration = 60;
                endDate = new Date(startDate.getTime() + duration * 60 * 1000);
            }
            items.push({
                id: e.id,
                type: 'event',
                title: e.title,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                durationMinutes: duration,
                moduleColor: e.color || TURN_CALENDAR_TYPE_CONFIG.event.color,
                moduleIcon: TURN_CALENDAR_TYPE_CONFIG.event.icon,
                isCompleted: false,
                link: `/calendar`,
            });
        }

        // -- Home Task Occurrences --
        for (const occ of homeOccurrences) {
            const homeTask = occ.task;
            if (!homeTask) continue;
            let startDate;
            const preferredTime = homeTask.preferred_time;
            if (preferredTime) {
                const hour = timePeriodToHour(preferredTime, turnStartHour);
                startDate = new Date(`${todayStr}T${String(hour).padStart(2, '0')}:00:00`);
            } else {
                startDate = new Date(`${todayStr}T${String(turnStartHour).padStart(2, '0')}:00:00`);
            }
            const duration = homeTask.estimated_minutes || 30;
            items.push({
                id: occ.id,
                type: 'home_task',
                title: homeTask.name,
                startTime: startDate.toISOString(),
                endTime: new Date(startDate.getTime() + duration * 60 * 1000).toISOString(),
                durationMinutes: duration,
                moduleColor: TURN_CALENDAR_TYPE_CONFIG.home_task.color,
                moduleIcon: TURN_CALENDAR_TYPE_CONFIG.home_task.icon,
                isCompleted: occ.status === 'COMPLETED',
                link: `/home-module`,
            });
        }

        // -- Social Events --
        for (const se of socialEvents) {
            let startDate;
            if (se.event_time) {
                startDate = buildDateTime(todayStr, se.event_time);
            } else {
                startDate = new Date(`${todayStr}T19:00:00`);
            }
            items.push({
                id: se.id,
                type: 'social',
                title: se.name,
                startTime: startDate.toISOString(),
                endTime: new Date(startDate.getTime() + 60 * 60 * 1000).toISOString(),
                durationMinutes: 60,
                moduleColor: TURN_CALENDAR_TYPE_CONFIG.social.color,
                moduleIcon: TURN_CALENDAR_TYPE_CONFIG.social.icon,
                isCompleted: se.status === 'COMPLETED',
                link: `/social`,
            });
        }

        // Step 5: Filter items within turn window
        const filteredItems = items.filter((item) => {
            const itemStart = new Date(item.startTime);
            const itemEnd = new Date(item.endTime);
            return itemStart < turnEnd && itemEnd > turnStart;
        });

        // Sort by start time
        filteredItems.sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        return reply.send({
            success: true,
            data: {
                items: filteredItems,
                currentTime: now.toISOString(),
                turnStartTime: turnStart.toISOString(),
                turnEndTime: turnEnd.toISOString(),
            },
        });
    } catch (error) {
        console.error('Error fetching turn calendar:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

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
    getTurnCalendar,
};

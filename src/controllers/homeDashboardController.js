const HomeSpace = require('../models/HomeSpace');
const HomeMember = require('../models/HomeMember');
const HomeTask = require('../models/HomeTask');
const HomeTaskOccurrence = require('../models/HomeTaskOccurrence');
const HomeMaintenance = require('../models/HomeMaintenance');
const HomeWarranty = require('../models/HomeWarranty');
const HomeBill = require('../models/HomeBill');
const HomeBillPayment = require('../models/HomeBillPayment');
const HomeStockItem = require('../models/HomeStockItem');
const { Op } = require('sequelize');

// Calculate Home Score
const calculateHomeScore = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 1. Tasks Score (40% weight)
        const tasks = await HomeTask.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const taskOccurrences = await HomeTaskOccurrence.findAll({
            where: {
                task_id: { [Op.in]: tasks.map((t) => t.id) },
                due_date: { [Op.lte]: today },
                status: { [Op.ne]: 'SKIPPED' },
            },
        });

        const completedTasks = taskOccurrences.filter((o) => o.status === 'COMPLETED').length;
        const totalDueTasks = taskOccurrences.length;
        const tasksScore = totalDueTasks > 0 ? (completedTasks / totalDueTasks) * 10 : 10;

        // 2. Maintenances Score (20% weight)
        const maintenances = await HomeMaintenance.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const overdueMaintenances = maintenances.filter((m) => {
            if (!m.next_due_at) return false;
            return new Date(m.next_due_at) < today;
        }).length;
        const totalMaintenances = maintenances.length;
        const maintenancesScore =
            totalMaintenances > 0
                ? ((totalMaintenances - overdueMaintenances) / totalMaintenances) * 10
                : 10;

        // 3. Bills Score (25% weight)
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const bills = await HomeBill.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const payments = await HomeBillPayment.findAll({
            where: {
                bill_id: { [Op.in]: bills.map((b) => b.id) },
                month: currentMonth,
                year: currentYear,
            },
        });

        const paidBills = payments.filter((p) => p.paid_at).length;
        const totalBills = bills.length;
        const billsScore = totalBills > 0 ? (paidBills / totalBills) * 10 : 10;

        // 4. Stock Score (15% weight)
        const stockItems = await HomeStockItem.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const lowStockItems = stockItems.filter(
            (item) => parseFloat(item.current_quantity) <= parseFloat(item.min_quantity)
        ).length;
        const totalStockItems = stockItems.length;
        const stockScore =
            totalStockItems > 0
                ? ((totalStockItems - lowStockItems) / totalStockItems) * 10
                : 10;

        // Calculate weighted average
        const homeScore =
            tasksScore * 0.4 +
            maintenancesScore * 0.2 +
            billsScore * 0.25 +
            stockScore * 0.15;

        // Determine status
        let status = 'excellent';
        let emoji = '💪';
        let color = '#22C55E';

        if (homeScore < 8) {
            status = 'good';
            emoji = '👍';
            color = '#22C55E';
        }
        if (homeScore < 5) {
            status = 'moderate';
            emoji = '👍';
            color = '#EAB308';
        }
        if (homeScore < 5) {
            status = 'attention';
            emoji = '⚠️';
            color = '#EF4444';
        }

        // Generate suggestions
        const suggestions = [];

        if (tasksScore < 8) {
            const pendingTasks = totalDueTasks - completedTasks;
            suggestions.push(`Completar ${pendingTasks} tarefa(s) pendente(s)`);
        }

        if (maintenancesScore < 10 && overdueMaintenances > 0) {
            suggestions.push(`Realizar ${overdueMaintenances} manutenção(ões) atrasada(s)`);
        }

        if (billsScore < 10) {
            const unpaidBills = totalBills - paidBills;
            suggestions.push(`Pagar ${unpaidBills} conta(s) pendente(s)`);
        }

        if (stockScore < 10 && lowStockItems > 0) {
            suggestions.push(`Repor ${lowStockItems} item(ns) com estoque baixo`);
        }

        return reply.send({
            success: true,
            data: {
                score: Math.round(homeScore * 10) / 10,
                status,
                emoji,
                color,
                factors: {
                    tasks: {
                        score: Math.round(tasksScore * 10) / 10,
                        completed: completedTasks,
                        total: totalDueTasks,
                        weight: 40,
                    },
                    maintenances: {
                        score: Math.round(maintenancesScore * 10) / 10,
                        overdue: overdueMaintenances,
                        total: totalMaintenances,
                        weight: 20,
                    },
                    bills: {
                        score: Math.round(billsScore * 10) / 10,
                        paid: paidBills,
                        total: totalBills,
                        weight: 25,
                    },
                    stock: {
                        score: Math.round(stockScore * 10) / 10,
                        lowStock: lowStockItems,
                        total: totalStockItems,
                        weight: 15,
                    },
                },
                suggestions,
            },
        });
    } catch (error) {
        console.error('Error calculating home score:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get dashboard data
const getDashboard = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        // Get space info
        const space = await HomeSpace.findByPk(spaceId);

        // Get today's tasks
        const tasks = await HomeTask.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const todayTasks = await HomeTaskOccurrence.findAll({
            where: {
                task_id: { [Op.in]: tasks.map((t) => t.id) },
                due_date: today,
            },
        });

        const completedToday = todayTasks.filter((t) => t.status === 'COMPLETED').length;
        const totalToday = todayTasks.length;

        // Get upcoming events
        const upcomingEvents = [];

        // Upcoming maintenances
        const maintenances = await HomeMaintenance.findAll({
            where: {
                space_id: spaceId,
                is_active: true,
                next_due_at: { [Op.between]: [today, nextWeek] },
            },
            order: [['next_due_at', 'ASC']],
            limit: 5,
        });

        maintenances.forEach((m) => {
            upcomingEvents.push({
                type: 'maintenance',
                icon: '🔧',
                name: m.name,
                dueDate: m.next_due_at,
            });
        });

        // Upcoming bills
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const bills = await HomeBill.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const pendingPayments = await HomeBillPayment.findAll({
            where: {
                bill_id: { [Op.in]: bills.map((b) => b.id) },
                month: currentMonth,
                year: currentYear,
                paid_at: null,
                due_date: { [Op.between]: [today, nextWeek] },
            },
        });

        for (const payment of pendingPayments) {
            const bill = bills.find((b) => b.id === payment.bill_id);
            if (bill) {
                upcomingEvents.push({
                    type: 'bill',
                    icon: '💰',
                    name: bill.name,
                    dueDate: payment.due_date,
                    amount: payment.amount,
                });
            }
        }

        // Sort events by date
        upcomingEvents.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        // Get alerts
        const alerts = [];

        // Low stock alerts
        const lowStockItems = await HomeStockItem.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const actualLowStock = lowStockItems.filter(
            (item) => parseFloat(item.current_quantity) <= parseFloat(item.min_quantity)
        );

        actualLowStock.slice(0, 3).forEach((item) => {
            alerts.push({
                type: 'low_stock',
                icon: '📦',
                message: `${item.name} com estoque baixo`,
                item,
            });
        });

        // Expiring items
        const expiringItems = await HomeStockItem.findAll({
            where: {
                space_id: spaceId,
                is_active: true,
                expiry_date: { [Op.between]: [today, nextWeek] },
            },
            limit: 3,
        });

        expiringItems.forEach((item) => {
            alerts.push({
                type: 'expiring',
                icon: '⚠️',
                message: `${item.name} vence em breve`,
                item,
            });
        });

        // Expiring warranties
        const warranties = await HomeWarranty.findAll({
            where: {
                space_id: spaceId,
                warranty_until: { [Op.between]: [today, nextWeek] },
            },
            limit: 3,
        });

        warranties.forEach((warranty) => {
            alerts.push({
                type: 'warranty_expiring',
                icon: '🛡️',
                message: `Garantia de ${warranty.item_name} vence em breve`,
                warranty,
            });
        });

        // Get member count
        const memberCount = await HomeMember.count({
            where: { space_id: spaceId, is_active: true },
        });

        // Calculate pending bills amount
        const pendingAmount = pendingPayments.reduce(
            (sum, p) => sum + parseFloat(p.amount),
            0
        );

        return reply.send({
            success: true,
            data: {
                space,
                quickStats: {
                    tasksToday: {
                        completed: completedToday,
                        total: totalToday,
                    },
                    alertsCount: alerts.length,
                    pendingBillsAmount: pendingAmount,
                    memberCount,
                },
                upcomingEvents: upcomingEvents.slice(0, 5),
                alerts: alerts.slice(0, 5),
            },
        });
    } catch (error) {
        console.error('Error getting dashboard:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get calendar events
const getCalendarEvents = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { month, year } = request.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0);

        const events = [];

        // Get task occurrences
        const tasks = await HomeTask.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const taskOccurrences = await HomeTaskOccurrence.findAll({
            where: {
                task_id: { [Op.in]: tasks.map((t) => t.id) },
                due_date: { [Op.between]: [startDate, endDate] },
            },
        });

        taskOccurrences.forEach((occurrence) => {
            const task = tasks.find((t) => t.id === occurrence.task_id);
            events.push({
                type: 'task',
                icon: '✅',
                date: occurrence.due_date,
                name: task ? task.name : 'Task',
                status: occurrence.status,
            });
        });

        // Get maintenances
        const maintenances = await HomeMaintenance.findAll({
            where: {
                space_id: spaceId,
                is_active: true,
                next_due_at: { [Op.between]: [startDate, endDate] },
            },
        });

        maintenances.forEach((m) => {
            events.push({
                type: 'maintenance',
                icon: '🔧',
                date: m.next_due_at,
                name: m.name,
            });
        });

        // Get bills
        const bills = await HomeBill.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        const payments = await HomeBillPayment.findAll({
            where: {
                bill_id: { [Op.in]: bills.map((b) => b.id) },
                month: targetMonth,
                year: targetYear,
            },
        });

        payments.forEach((payment) => {
            const bill = bills.find((b) => b.id === payment.bill_id);
            events.push({
                type: 'bill',
                icon: '💰',
                date: payment.due_date,
                name: bill ? bill.name : 'Bill',
                isPaid: !!payment.paid_at,
            });
        });

        // Group by date
        const eventsByDate = {};
        events.forEach((event) => {
            const dateKey = event.date;
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });

        return reply.send({
            success: true,
            data: {
                month: targetMonth,
                year: targetYear,
                events,
                eventsByDate,
            },
        });
    } catch (error) {
        console.error('Error getting calendar events:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    calculateHomeScore,
    getDashboard,
    getCalendarEvents,
};

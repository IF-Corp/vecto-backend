const {
    WorkInvoice,
    WorkClient,
    WorkProject,
    WorkTimeEntry,
} = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// ==================== BILLING ====================

const getBillingSummary = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate } = request.query;

        // Default to current month
        const now = new Date();
        const start = startDate
            ? new Date(startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endDate
            ? new Date(endDate)
            : new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get all clients with their projects
        const clients = await WorkClient.findAll({
            where: { user_id: userId },
            include: [
                {
                    association: 'projects',
                    attributes: ['id', 'name', 'hourly_rate'],
                },
            ],
        });

        const clientBilling = await Promise.all(
            clients.map(async (client) => {
                const projectIds = client.projects.map((p) => p.id);

                if (projectIds.length === 0) {
                    return null;
                }

                // Get billable time entries for this client
                const entries = await WorkTimeEntry.findAll({
                    where: {
                        user_id: userId,
                        project_id: { [Op.in]: projectIds },
                        is_billable: true,
                        started_at: { [Op.between]: [start, end] },
                    },
                    include: [
                        { association: 'project', attributes: ['id', 'name', 'hourly_rate'] },
                    ],
                });

                const totalMinutes = entries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0);
                const totalHours = Math.round((totalMinutes / 60) * 100) / 100;

                // Calculate value using project rate or client rate
                let totalValue = 0;
                entries.forEach((e) => {
                    const rate = parseFloat(e.project?.hourly_rate) || parseFloat(client.hourly_rate) || 0;
                    const hours = (e.duration_minutes || 0) / 60;
                    totalValue += hours * rate;
                });

                // Get invoices for this client
                const invoices = await WorkInvoice.findAll({
                    where: {
                        user_id: userId,
                        client_id: client.id,
                        period_start: { [Op.gte]: start },
                        period_end: { [Op.lte]: end },
                    },
                });

                const invoicedValue = invoices
                    .filter((i) => i.status === 'INVOICED' || i.status === 'PAID')
                    .reduce((sum, i) => sum + parseFloat(i.total_value), 0);

                const paidValue = invoices
                    .filter((i) => i.status === 'PAID')
                    .reduce((sum, i) => sum + parseFloat(i.total_value), 0);

                return {
                    client: {
                        id: client.id,
                        name: client.name,
                        company: client.company,
                        hourlyRate: parseFloat(client.hourly_rate) || 0,
                    },
                    totalHours,
                    totalValue: Math.round(totalValue * 100) / 100,
                    invoicedValue: Math.round(invoicedValue * 100) / 100,
                    paidValue: Math.round(paidValue * 100) / 100,
                    pendingValue: Math.round((totalValue - invoicedValue) * 100) / 100,
                    invoices,
                };
            })
        );

        const validClientBilling = clientBilling.filter((c) => c !== null);

        // Calculate totals
        const totals = validClientBilling.reduce(
            (acc, c) => ({
                totalHours: acc.totalHours + c.totalHours,
                totalValue: acc.totalValue + c.totalValue,
                invoicedValue: acc.invoicedValue + c.invoicedValue,
                paidValue: acc.paidValue + c.paidValue,
                pendingValue: acc.pendingValue + c.pendingValue,
            }),
            { totalHours: 0, totalValue: 0, invoicedValue: 0, paidValue: 0, pendingValue: 0 }
        );

        return {
            success: true,
            data: {
                period: { start: start.toISOString(), end: end.toISOString() },
                summary: {
                    totalHours: Math.round(totals.totalHours * 100) / 100,
                    totalValue: Math.round(totals.totalValue * 100) / 100,
                    invoicedValue: Math.round(totals.invoicedValue * 100) / 100,
                    paidValue: Math.round(totals.paidValue * 100) / 100,
                    pendingValue: Math.round(totals.pendingValue * 100) / 100,
                },
                byClient: validClientBilling,
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getInvoices = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { clientId, status } = request.query;

        const where = { user_id: userId };
        if (clientId) where.client_id = clientId;
        if (status) where.status = status;

        const invoices = await WorkInvoice.findAll({
            where,
            include: [
                { association: 'client', attributes: ['id', 'name', 'company'] },
            ],
            order: [['created_at', 'DESC']],
        });

        return { success: true, data: invoices };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getInvoice = async (request, reply) => {
    try {
        const { id } = request.params;
        const invoice = await WorkInvoice.findByPk(id, {
            include: [
                { association: 'client' },
            ],
        });

        if (!invoice) {
            reply.status(404);
            return { success: false, error: 'Invoice not found' };
        }

        // Get time entries for this invoice period
        const entries = await WorkTimeEntry.findAll({
            where: {
                user_id: invoice.user_id,
                is_billable: true,
                started_at: {
                    [Op.between]: [
                        new Date(invoice.period_start),
                        new Date(invoice.period_end + 'T23:59:59'),
                    ],
                },
            },
            include: [
                { association: 'project', where: { client_id: invoice.client_id } },
                { association: 'task', attributes: ['id', 'title'] },
            ],
        });

        return { success: true, data: { invoice, entries } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createInvoice = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { clientId, periodStart, periodEnd, notes } = request.body;

        // Get client and their rate
        const client = await WorkClient.findByPk(clientId, {
            include: [{ association: 'projects', attributes: ['id', 'hourly_rate'] }],
        });

        if (!client) {
            reply.status(404);
            return { success: false, error: 'Client not found' };
        }

        const projectIds = client.projects.map((p) => p.id);

        // Get billable entries for period
        const entries = await WorkTimeEntry.findAll({
            where: {
                user_id: userId,
                project_id: { [Op.in]: projectIds },
                is_billable: true,
                started_at: {
                    [Op.between]: [new Date(periodStart), new Date(periodEnd + 'T23:59:59')],
                },
            },
            include: [
                { association: 'project', attributes: ['id', 'hourly_rate'] },
            ],
        });

        const totalMinutes = entries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0);
        const totalHours = Math.round((totalMinutes / 60) * 100) / 100;

        // Calculate total value
        let totalValue = 0;
        entries.forEach((e) => {
            const rate = parseFloat(e.project?.hourly_rate) || parseFloat(client.hourly_rate) || 0;
            const hours = (e.duration_minutes || 0) / 60;
            totalValue += hours * rate;
        });

        const hourlyRate = totalHours > 0 ? Math.round((totalValue / totalHours) * 100) / 100 : parseFloat(client.hourly_rate) || 0;

        // Generate invoice number
        const invoiceCount = await WorkInvoice.count({ where: { user_id: userId } });
        const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(4, '0')}`;

        const invoice = await WorkInvoice.create({
            user_id: userId,
            client_id: clientId,
            invoice_number: invoiceNumber,
            period_start: periodStart,
            period_end: periodEnd,
            total_hours: totalHours,
            hourly_rate: hourlyRate,
            total_value: Math.round(totalValue * 100) / 100,
            status: 'PENDING',
            notes,
        });

        const invoiceWithClient = await WorkInvoice.findByPk(invoice.id, {
            include: [{ association: 'client', attributes: ['id', 'name', 'company'] }],
        });

        reply.status(201);
        return { success: true, data: invoiceWithClient, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateInvoice = async (request, reply) => {
    try {
        const { id } = request.params;
        const invoice = await WorkInvoice.findByPk(id);

        if (!invoice) {
            reply.status(404);
            return { success: false, error: 'Invoice not found' };
        }

        await invoice.update(request.body);

        const invoiceWithClient = await WorkInvoice.findByPk(id, {
            include: [{ association: 'client', attributes: ['id', 'name', 'company'] }],
        });

        return { success: true, data: invoiceWithClient };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const markInvoiced = async (request, reply) => {
    try {
        const { id } = request.params;
        const invoice = await WorkInvoice.findByPk(id);

        if (!invoice) {
            reply.status(404);
            return { success: false, error: 'Invoice not found' };
        }

        await invoice.update({
            status: 'INVOICED',
            invoiced_at: new Date(),
        });

        return { success: true, data: invoice };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const markPaid = async (request, reply) => {
    try {
        const { id } = request.params;
        const { financeTransactionId } = request.body;

        const invoice = await WorkInvoice.findByPk(id, {
            include: [{ association: 'client' }],
        });

        if (!invoice) {
            reply.status(404);
            return { success: false, error: 'Invoice not found' };
        }

        await invoice.update({
            status: 'PAID',
            paid_at: new Date(),
            finance_transaction_id: financeTransactionId,
        });

        return { success: true, data: invoice };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteInvoice = async (request, reply) => {
    try {
        const { id } = request.params;
        const invoice = await WorkInvoice.findByPk(id);

        if (!invoice) {
            reply.status(404);
            return { success: false, error: 'Invoice not found' };
        }

        if (invoice.status === 'PAID') {
            reply.status(400);
            return { success: false, error: 'Cannot delete paid invoice' };
        }

        await invoice.destroy();
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== TIMESHEET REPORTS ====================

const getTimesheetReport = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate, groupBy = 'project' } = request.query;

        // Default to current month
        const now = new Date();
        const start = startDate
            ? new Date(startDate)
            : new Date(now.getFullYear(), now.getMonth(), 1);
        const end = endDate
            ? new Date(endDate)
            : new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const entries = await WorkTimeEntry.findAll({
            where: {
                user_id: userId,
                started_at: { [Op.between]: [start, end] },
            },
            include: [
                {
                    association: 'project',
                    attributes: ['id', 'name', 'color', 'client_id'],
                    include: [
                        { association: 'clientRef', attributes: ['id', 'name'] },
                    ],
                },
                { association: 'task', attributes: ['id', 'title'] },
            ],
        });

        const totalMinutes = entries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0);
        const totalHours = Math.round((totalMinutes / 60) * 10) / 10;

        // Group by project
        const byProject = {};
        entries.forEach((e) => {
            const projectId = e.project_id || 'no-project';
            if (!byProject[projectId]) {
                byProject[projectId] = {
                    project: e.project || { id: 'no-project', name: 'Sem Projeto', color: '#6b7280' },
                    minutes: 0,
                    entries: [],
                };
            }
            byProject[projectId].minutes += e.duration_minutes || 0;
            byProject[projectId].entries.push(e);
        });

        const projectBreakdown = Object.values(byProject)
            .map((p) => ({
                project: p.project,
                hours: Math.round((p.minutes / 60) * 10) / 10,
                percentage: totalMinutes > 0 ? Math.round((p.minutes / totalMinutes) * 100) : 0,
            }))
            .sort((a, b) => b.hours - a.hours);

        // Group by client
        const byClient = {};
        entries.forEach((e) => {
            const client = e.project?.clientRef;
            const clientId = client?.id || 'no-client';
            if (!byClient[clientId]) {
                byClient[clientId] = {
                    client: client || { id: 'no-client', name: 'Interno' },
                    minutes: 0,
                };
            }
            byClient[clientId].minutes += e.duration_minutes || 0;
        });

        const clientBreakdown = Object.values(byClient)
            .map((c) => ({
                client: c.client,
                hours: Math.round((c.minutes / 60) * 10) / 10,
                percentage: totalMinutes > 0 ? Math.round((c.minutes / totalMinutes) * 100) : 0,
            }))
            .sort((a, b) => b.hours - a.hours);

        // Group by weekday
        const byWeekday = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
        entries.forEach((e) => {
            const day = new Date(e.started_at).getDay();
            byWeekday[day] += e.duration_minutes || 0;
        });

        const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        const weekdayBreakdown = byWeekday.map((minutes, index) => ({
            day: weekdayLabels[index],
            hours: Math.round((minutes / 60) * 10) / 10,
        }));

        return {
            success: true,
            data: {
                period: { start: start.toISOString(), end: end.toISOString() },
                totalHours,
                byProject: projectBreakdown,
                byClient: clientBreakdown,
                byWeekday: weekdayBreakdown,
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Billing
    getBillingSummary,
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    markInvoiced,
    markPaid,
    deleteInvoice,
    // Reports
    getTimesheetReport,
};

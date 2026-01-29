const HomeBill = require('../models/HomeBill');
const HomeBillPayment = require('../models/HomeBillPayment');
const HomeCostSplitSettings = require('../models/HomeCostSplitSettings');
const HomeCostSplitMember = require('../models/HomeCostSplitMember');
const HomeMember = require('../models/HomeMember');
const { Op } = require('sequelize');

// Get all bills for a space
const getBills = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        const bills = await HomeBill.findAll({
            where: { space_id: spaceId, is_active: true },
            order: [['due_day', 'ASC']],
        });

        return reply.send({ success: true, data: bills });
    } catch (error) {
        console.error('Error getting bills:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get a single bill
const getBill = async (request, reply) => {
    try {
        const { userId, spaceId, billId } = request.params;

        const bill = await HomeBill.findOne({
            where: { id: billId, space_id: spaceId },
        });

        if (!bill) {
            return reply.status(404).send({ success: false, error: 'Bill not found' });
        }

        return reply.send({ success: true, data: bill });
    } catch (error) {
        console.error('Error getting bill:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Create a new bill
const createBill = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const data = request.body;

        const bill = await HomeBill.create({
            ...data,
            space_id: spaceId,
        });

        return reply.status(201).send({ success: true, data: bill });
    } catch (error) {
        console.error('Error creating bill:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update a bill
const updateBill = async (request, reply) => {
    try {
        const { userId, spaceId, billId } = request.params;
        const data = request.body;

        const bill = await HomeBill.findOne({
            where: { id: billId, space_id: spaceId },
        });

        if (!bill) {
            return reply.status(404).send({ success: false, error: 'Bill not found' });
        }

        await bill.update(data);

        return reply.send({ success: true, data: bill });
    } catch (error) {
        console.error('Error updating bill:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Delete a bill
const deleteBill = async (request, reply) => {
    try {
        const { userId, spaceId, billId } = request.params;

        const bill = await HomeBill.findOne({
            where: { id: billId, space_id: spaceId },
        });

        if (!bill) {
            return reply.status(404).send({ success: false, error: 'Bill not found' });
        }

        await bill.update({ is_active: false });

        return reply.send({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
        console.error('Error deleting bill:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get bill payments for a month
const getBillPayments = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { month, year } = request.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Get all active bills
        const bills = await HomeBill.findAll({
            where: { space_id: spaceId, is_active: true },
        });

        // Get or create payments for each bill
        const payments = await Promise.all(
            bills.map(async (bill) => {
                let payment = await HomeBillPayment.findOne({
                    where: {
                        bill_id: bill.id,
                        month: targetMonth,
                        year: targetYear,
                    },
                });

                if (!payment) {
                    // Calculate due date
                    const dueDate = new Date(targetYear, targetMonth - 1, bill.due_day);

                    payment = await HomeBillPayment.create({
                        bill_id: bill.id,
                        month: targetMonth,
                        year: targetYear,
                        amount: bill.average_amount,
                        due_date: dueDate,
                    });
                }

                return {
                    ...payment.toJSON(),
                    bill,
                };
            })
        );

        return reply.send({ success: true, data: payments });
    } catch (error) {
        console.error('Error getting bill payments:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Pay a bill
const payBill = async (request, reply) => {
    try {
        const { userId, spaceId, billId } = request.params;
        const { month, year, amount, paidByMemberId, notes } = request.body;

        let payment = await HomeBillPayment.findOne({
            where: {
                bill_id: billId,
                month,
                year,
            },
        });

        if (!payment) {
            const bill = await HomeBill.findByPk(billId);
            const dueDate = new Date(year, month - 1, bill.due_day);

            payment = await HomeBillPayment.create({
                bill_id: billId,
                month,
                year,
                amount: amount || bill.average_amount,
                due_date: dueDate,
            });
        }

        await payment.update({
            amount: amount || payment.amount,
            paid_at: new Date(),
            paid_by_member_id: paidByMemberId,
            notes,
        });

        return reply.send({ success: true, data: payment });
    } catch (error) {
        console.error('Error paying bill:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get cost split settings
const getCostSplitSettings = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;

        let settings = await HomeCostSplitSettings.findOne({
            where: { space_id: spaceId },
        });

        if (!settings) {
            settings = await HomeCostSplitSettings.create({
                space_id: spaceId,
                split_type: 'EQUAL',
            });
        }

        const memberSplits = await HomeCostSplitMember.findAll({
            where: { split_settings_id: settings.id },
        });

        return reply.send({
            success: true,
            data: {
                settings,
                memberSplits,
            },
        });
    } catch (error) {
        console.error('Error getting cost split settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update cost split settings
const updateCostSplitSettings = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { splitType, memberSplits } = request.body;

        let settings = await HomeCostSplitSettings.findOne({
            where: { space_id: spaceId },
        });

        if (!settings) {
            settings = await HomeCostSplitSettings.create({
                space_id: spaceId,
                split_type: splitType,
            });
        } else {
            await settings.update({ split_type: splitType });
        }

        // Update member splits if custom
        if (splitType === 'CUSTOM' && memberSplits) {
            // Delete existing splits
            await HomeCostSplitMember.destroy({
                where: { split_settings_id: settings.id },
            });

            // Create new splits
            await Promise.all(
                memberSplits.map((split) =>
                    HomeCostSplitMember.create({
                        split_settings_id: settings.id,
                        member_id: split.memberId,
                        percentage: split.percentage,
                    })
                )
            );
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating cost split settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Calculate cost split for a month
const calculateCostSplit = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { month, year } = request.query;

        const currentDate = new Date();
        const targetMonth = month ? parseInt(month) : currentDate.getMonth() + 1;
        const targetYear = year ? parseInt(year) : currentDate.getFullYear();

        // Get all payments for the month
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

        // Calculate totals
        const totalAmount = payments.reduce(
            (sum, p) => sum + parseFloat(p.amount),
            0
        );
        const totalPaid = payments
            .filter((p) => p.paid_at)
            .reduce((sum, p) => sum + parseFloat(p.amount), 0);

        // Get members who participate in costs
        const members = await HomeMember.findAll({
            where: { space_id: spaceId, is_active: true, participates_costs: true },
        });

        // Get split settings
        let settings = await HomeCostSplitSettings.findOne({
            where: { space_id: spaceId },
        });

        // Calculate per member
        let memberBalances = [];

        if (!settings || settings.split_type === 'EQUAL') {
            const perPerson = totalAmount / members.length;

            memberBalances = await Promise.all(
                members.map(async (member) => {
                    const paidByMember = payments
                        .filter((p) => p.paid_by_member_id === member.id && p.paid_at)
                        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

                    return {
                        member,
                        owes: perPerson,
                        paid: paidByMember,
                        balance: paidByMember - perPerson,
                    };
                })
            );
        } else {
            const memberSplits = await HomeCostSplitMember.findAll({
                where: { split_settings_id: settings.id },
            });

            memberBalances = await Promise.all(
                members.map(async (member) => {
                    const splitConfig = memberSplits.find(
                        (s) => s.member_id === member.id
                    );
                    const percentage = splitConfig
                        ? parseFloat(splitConfig.percentage)
                        : 0;
                    const owes = (totalAmount * percentage) / 100;

                    const paidByMember = payments
                        .filter((p) => p.paid_by_member_id === member.id && p.paid_at)
                        .reduce((sum, p) => sum + parseFloat(p.amount), 0);

                    return {
                        member,
                        percentage,
                        owes,
                        paid: paidByMember,
                        balance: paidByMember - owes,
                    };
                })
            );
        }

        return reply.send({
            success: true,
            data: {
                month: targetMonth,
                year: targetYear,
                totalAmount,
                totalPaid,
                totalPending: totalAmount - totalPaid,
                memberBalances,
            },
        });
    } catch (error) {
        console.error('Error calculating cost split:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get cost history
const getCostHistory = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { months = 6 } = request.query;

        const history = [];
        const currentDate = new Date();

        for (let i = 0; i < parseInt(months); i++) {
            const targetDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - i,
                1
            );
            const month = targetDate.getMonth() + 1;
            const year = targetDate.getFullYear();

            const bills = await HomeBill.findAll({
                where: { space_id: spaceId, is_active: true },
            });

            const payments = await HomeBillPayment.findAll({
                where: {
                    bill_id: { [Op.in]: bills.map((b) => b.id) },
                    month,
                    year,
                },
            });

            const totalAmount = payments.reduce(
                (sum, p) => sum + parseFloat(p.amount),
                0
            );

            history.push({
                month,
                year,
                totalAmount,
            });
        }

        return reply.send({ success: true, data: history.reverse() });
    } catch (error) {
        console.error('Error getting cost history:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    getBills,
    getBill,
    createBill,
    updateBill,
    deleteBill,
    getBillPayments,
    payBill,
    getCostSplitSettings,
    updateCostSplitSettings,
    calculateCostSplit,
    getCostHistory,
};

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('home_bill_payments', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            bill_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_bills',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            month: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 12,
                },
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            due_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            paid_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            paid_by_member_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            finance_transaction_id: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('home_bill_payments', ['bill_id']);
        await queryInterface.addIndex('home_bill_payments', ['month', 'year']);
        await queryInterface.addIndex('home_bill_payments', ['due_date']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_bill_payments');
    },
};

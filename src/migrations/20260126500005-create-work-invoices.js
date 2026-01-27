'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_invoices', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            client_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_clients',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            invoice_number: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            period_start: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            period_end: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            total_hours: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            hourly_rate: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            total_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'INVOICED', 'PAID'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            invoiced_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            paid_at: {
                type: Sequelize.DATE,
                allowNull: true,
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

        await queryInterface.addIndex('work_invoices', ['user_id']);
        await queryInterface.addIndex('work_invoices', ['client_id']);
        await queryInterface.addIndex('work_invoices', ['status']);
        await queryInterface.addIndex('work_invoices', ['period_start', 'period_end']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_invoices');
    },
};

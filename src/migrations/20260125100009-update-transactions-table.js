'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Add user_id column
        await queryInterface.addColumn('transactions', 'user_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
        });

        // Add category_id column
        await queryInterface.addColumn('transactions', 'category_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'finance_categories',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add card_id column
        await queryInterface.addColumn('transactions', 'card_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'cards',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add invoice_id column
        await queryInterface.addColumn('transactions', 'invoice_id', {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
                model: 'invoices',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        });

        // Add installment fields
        await queryInterface.addColumn('transactions', 'is_installment', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });

        await queryInterface.addColumn('transactions', 'installment_id', {
            type: Sequelize.UUID,
            allowNull: true
        });

        await queryInterface.addColumn('transactions', 'current_installment', {
            type: Sequelize.INTEGER,
            allowNull: true
        });

        await queryInterface.addColumn('transactions', 'total_installments', {
            type: Sequelize.INTEGER,
            allowNull: true
        });

        // Add recurring fields
        await queryInterface.addColumn('transactions', 'is_recurring', {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        });

        await queryInterface.addColumn('transactions', 'recurring_id', {
            type: Sequelize.UUID,
            allowNull: true
        });

        // Add notes and attachment
        await queryInterface.addColumn('transactions', 'notes', {
            type: Sequelize.STRING(500),
            allowNull: true
        });

        await queryInterface.addColumn('transactions', 'attachment_url', {
            type: Sequelize.STRING(500),
            allowNull: true
        });

        // Add indexes
        await queryInterface.addIndex('transactions', ['user_id'], {
            name: 'transactions_user_id_idx'
        });

        await queryInterface.addIndex('transactions', ['user_id', 'transaction_date'], {
            name: 'transactions_user_date_idx'
        });

        await queryInterface.addIndex('transactions', ['installment_id'], {
            name: 'transactions_installment_id_idx'
        });

        await queryInterface.addIndex('transactions', ['recurring_id'], {
            name: 'transactions_recurring_id_idx'
        });

        // Update status enum to include new values
        await queryInterface.changeColumn('transactions', 'status', {
            type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'CONSOLIDATED'),
            defaultValue: 'CONFIRMED',
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('transactions', 'transactions_user_id_idx');
        await queryInterface.removeIndex('transactions', 'transactions_user_date_idx');
        await queryInterface.removeIndex('transactions', 'transactions_installment_id_idx');
        await queryInterface.removeIndex('transactions', 'transactions_recurring_id_idx');

        await queryInterface.removeColumn('transactions', 'user_id');
        await queryInterface.removeColumn('transactions', 'category_id');
        await queryInterface.removeColumn('transactions', 'card_id');
        await queryInterface.removeColumn('transactions', 'invoice_id');
        await queryInterface.removeColumn('transactions', 'is_installment');
        await queryInterface.removeColumn('transactions', 'installment_id');
        await queryInterface.removeColumn('transactions', 'current_installment');
        await queryInterface.removeColumn('transactions', 'total_installments');
        await queryInterface.removeColumn('transactions', 'is_recurring');
        await queryInterface.removeColumn('transactions', 'recurring_id');
        await queryInterface.removeColumn('transactions', 'notes');
        await queryInterface.removeColumn('transactions', 'attachment_url');
    }
};

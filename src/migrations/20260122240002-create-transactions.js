'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('transactions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            account_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'accounts',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            primary_category: {
                type: Sequelize.STRING,
                allowNull: true
            },
            secondary_category: {
                type: Sequelize.STRING,
                allowNull: true
            },
            description: {
                type: Sequelize.STRING,
                allowNull: true
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('INCOME', 'EXPENSE'),
                allowNull: false
            },
            transaction_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'CONSOLIDATED'),
                defaultValue: 'PENDING',
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await queryInterface.addIndex('transactions', ['account_id'], {
            name: 'transactions_account_id_idx'
        });

        await queryInterface.addIndex('transactions', ['transaction_date'], {
            name: 'transactions_date_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('transactions');
    }
};

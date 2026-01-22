'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('budgets', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            category: {
                type: Sequelize.STRING,
                allowNull: false
            },
            limit_amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            spent_amount: {
                type: Sequelize.DECIMAL(10, 2),
                defaultValue: 0,
                allowNull: false
            },
            period: {
                type: Sequelize.ENUM('WEEKLY', 'MONTHLY', 'YEARLY'),
                allowNull: false
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            alert_threshold: {
                type: Sequelize.INTEGER,
                defaultValue: 80,
                allowNull: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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

        await queryInterface.addIndex('budgets', ['user_id']);
        await queryInterface.addIndex('budgets', ['category']);
        await queryInterface.addIndex('budgets', ['is_active']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('budgets');
    }
};

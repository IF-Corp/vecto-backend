'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('recurring_expenses', {
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
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            amount: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            frequency: {
                type: Sequelize.ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
                allowNull: false
            },
            category: {
                type: Sequelize.STRING,
                allowNull: true
            },
            due_day: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            next_due_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
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

        await queryInterface.addIndex('recurring_expenses', ['user_id']);
        await queryInterface.addIndex('recurring_expenses', ['is_active']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('recurring_expenses');
    }
};

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Projects table
        await queryInterface.createTable('home_projects', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            space_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_spaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            budget: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            deadline: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PLANNING',
            },
            notes: {
                type: Sequelize.TEXT,
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

        // Project tasks table
        await queryInterface.createTable('home_project_tasks', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_projects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            estimated_cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            actual_cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            is_completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            completed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            sort_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

        await queryInterface.addIndex('home_projects', ['space_id']);
        await queryInterface.addIndex('home_projects', ['status']);
        await queryInterface.addIndex('home_project_tasks', ['project_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_project_tasks');
        await queryInterface.dropTable('home_projects');
    },
};

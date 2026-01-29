'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Meal plans table
        await queryInterface.createTable('home_meal_plans', {
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
            week_start: {
                type: Sequelize.DATEONLY,
                allowNull: false,
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

        // Meals table
        await queryInterface.createTable('home_meals', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            meal_plan_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_meal_plans',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            day_of_week: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 6,
                },
            },
            meal_type: {
                type: Sequelize.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            recipe_id: {
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

        // Recipes table
        await queryInterface.createTable('home_recipes', {
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
            category: {
                type: Sequelize.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK', 'DESSERT'),
                allowNull: true,
            },
            prep_time_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            ingredients: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            instructions: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_favorite: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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

        await queryInterface.addIndex('home_meal_plans', ['space_id', 'week_start']);
        await queryInterface.addIndex('home_meals', ['meal_plan_id']);
        await queryInterface.addIndex('home_recipes', ['space_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_meals');
        await queryInterface.dropTable('home_meal_plans');
        await queryInterface.dropTable('home_recipes');
    },
};

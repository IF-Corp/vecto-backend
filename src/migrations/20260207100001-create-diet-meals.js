'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('diet_meals', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            diet_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'diets',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            meal_type: {
                type: Sequelize.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'),
                allowNull: true
            },
            meal_time: {
                type: Sequelize.TIME,
                allowNull: true
            },
            calories: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            protein: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            carbs: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            fat: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            meal_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
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

        await queryInterface.addIndex('diet_meals', ['diet_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('diet_meals');
    }
};

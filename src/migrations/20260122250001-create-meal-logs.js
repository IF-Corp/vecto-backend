'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('meal_logs', {
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
            meal_type: {
                type: Sequelize.ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
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
            meal_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            photo_url: {
                type: Sequelize.STRING,
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

        await queryInterface.addIndex('meal_logs', ['user_id']);
        await queryInterface.addIndex('meal_logs', ['meal_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('meal_logs');
    }
};

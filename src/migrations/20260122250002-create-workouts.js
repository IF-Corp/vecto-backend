'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('workouts', {
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
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('STRENGTH', 'CARDIO', 'FLEXIBILITY', 'SPORTS', 'OTHER'),
                allowNull: false
            },
            duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            calories_burned: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            workout_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            notes: {
                type: Sequelize.TEXT,
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

        await queryInterface.addIndex('workouts', ['user_id']);
        await queryInterface.addIndex('workouts', ['workout_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('workouts');
    }
};

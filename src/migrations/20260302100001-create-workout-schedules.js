'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('workout_schedules', {
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
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            workout_type: {
                type: Sequelize.ENUM('CARDIO', 'STRENGTH', 'FLEXIBILITY', 'SPORTS', 'OTHER'),
                allowNull: false,
            },
            day_of_week: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            scheduled_time: {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('workout_schedules', ['user_id']);
        await queryInterface.addIndex('workout_schedules', ['day_of_week']);
        await queryInterface.addIndex('workout_schedules', ['user_id', 'day_of_week']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('workout_schedules');
    },
};

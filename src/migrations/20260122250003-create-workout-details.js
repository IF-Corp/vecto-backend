'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('workout_details', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            workout_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'workouts',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            exercise_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sets: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            reps: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            weight: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            duration_seconds: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            distance_meters: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true
            },
            order_index: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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

        await queryInterface.addIndex('workout_details', ['workout_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('workout_details');
    }
};

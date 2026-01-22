'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sleep_metrics', {
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
            sleep_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            bedtime: {
                type: Sequelize.DATE,
                allowNull: true
            },
            wake_time: {
                type: Sequelize.DATE,
                allowNull: true
            },
            duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            quality_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            deep_sleep_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            rem_sleep_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            interruptions: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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

        await queryInterface.addIndex('sleep_metrics', ['user_id']);
        await queryInterface.addIndex('sleep_metrics', ['sleep_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sleep_metrics');
    }
};

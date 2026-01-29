'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('freeze_options', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            freeze_period_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'freeze_periods',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            freeze_streaks: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            hide_non_essential_tasks: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            pause_general_notifications: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            pause_goals: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            keep_important_events: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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

        await queryInterface.addIndex('freeze_options', ['freeze_period_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('freeze_options');
    }
};

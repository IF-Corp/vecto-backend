'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Dashboard Settings
        await queryInterface.createTable('dashboard_settings', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },
            show_turn_calendar: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            turn_duration_hours: {
                type: Sequelize.INTEGER,
                defaultValue: 8,
            },
            show_weekly_metrics: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            show_greeting: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            show_alerts: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });

        await queryInterface.addIndex('dashboard_settings', ['user_id'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('dashboard_settings');
    },
};

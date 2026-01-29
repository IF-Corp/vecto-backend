'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Notification Settings
        await queryInterface.createTable('notification_settings', {
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
            // Channels
            email_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            push_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            // Types
            reminders_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            alerts_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            reports_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            gamification_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            // Quiet Hours
            quiet_hours_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            quiet_hours_start: {
                type: Sequelize.STRING(5),
                defaultValue: '22:00',
            },
            quiet_hours_end: {
                type: Sequelize.STRING(5),
                defaultValue: '08:00',
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

        await queryInterface.addIndex('notification_settings', ['user_id'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('notification_settings');
    },
};

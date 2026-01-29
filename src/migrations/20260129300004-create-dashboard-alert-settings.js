'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Alert types enum
        await queryInterface.sequelize.query(`
            CREATE TYPE alert_type AS ENUM (
                'STREAK_RISK', 'OVERDUE_TASKS', 'UPCOMING_BILLS', 'BIRTHDAYS',
                'HIGH_STRAIN', 'MEDICATIONS', 'MAINTENANCES', 'DEADLINES',
                'LOW_STOCK', 'SOCIAL_NEEDS_ATTENTION', 'UPCOMING_EVENTS'
            );
        `);

        // Dashboard Alert Settings
        await queryInterface.createTable('dashboard_alert_settings', {
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
            alert_type: {
                type: 'alert_type',
                allowNull: false,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            days_before: {
                type: Sequelize.INTEGER,
                defaultValue: 3,
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

        await queryInterface.addIndex('dashboard_alert_settings', ['user_id']);
        await queryInterface.addIndex('dashboard_alert_settings', ['user_id', 'alert_type'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('dashboard_alert_settings');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS alert_type;');
    },
};

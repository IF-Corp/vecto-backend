'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Widget types enum
        await queryInterface.sequelize.query(`
            CREATE TYPE widget_type AS ENUM (
                'HABITS_TODAY', 'TASKS_TODAY', 'WORK', 'UPCOMING_EVENTS',
                'FINANCIAL_SUMMARY', 'MODULE_SCORES', 'HOME', 'SOCIAL',
                'HEALTH', 'STUDY', 'CALENDAR'
            );
        `);

        // Dashboard Widgets
        await queryInterface.createTable('dashboard_widgets', {
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
            widget_type: {
                type: 'widget_type',
                allowNull: false,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            display_order: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            column_position: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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

        await queryInterface.addIndex('dashboard_widgets', ['user_id']);
        await queryInterface.addIndex('dashboard_widgets', ['user_id', 'widget_type'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('dashboard_widgets');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS widget_type;');
    },
};

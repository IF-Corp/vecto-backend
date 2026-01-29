'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Quick Stats types enum
        await queryInterface.sequelize.query(`
            CREATE TYPE quick_stat_type AS ENUM (
                'HABITS', 'TASKS', 'WORK', 'RECOVERY', 'BALANCE',
                'CALORIES', 'STUDY_TIME', 'HOME_TASKS', 'SOCIAL_BATTERY'
            );
        `);

        // Dashboard Quick Stats
        await queryInterface.createTable('dashboard_quick_stats', {
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
            stat_type: {
                type: 'quick_stat_type',
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

        await queryInterface.addIndex('dashboard_quick_stats', ['user_id']);
        await queryInterface.addIndex('dashboard_quick_stats', ['user_id', 'stat_type'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('dashboard_quick_stats');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS quick_stat_type;');
    },
};

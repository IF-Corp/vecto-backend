'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_settings', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            algorithm_type: {
                type: Sequelize.ENUM('LEITNER', 'FSRS_VECTO'),
                allowNull: false,
                defaultValue: 'FSRS_VECTO',
            },
            weekly_goal_hours: {
                type: Sequelize.DECIMAL(4, 1),
                allowNull: true,
                defaultValue: 20,
            },
            preferred_times: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                allowNull: true,
                defaultValue: ['morning', 'evening'],
            },
            notifications_enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('study_settings', ['user_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_settings');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_settings_algorithm_type";');
    },
};

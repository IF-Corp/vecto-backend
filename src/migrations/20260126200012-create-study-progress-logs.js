'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_progress_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
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
            resource_type: {
                type: Sequelize.ENUM('BOOK', 'COURSE_ONLINE'),
                allowNull: false,
            },
            resource_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            progress_from: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            progress_to: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            time_spent_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('study_progress_logs', ['user_id']);
        await queryInterface.addIndex('study_progress_logs', ['resource_type', 'resource_id']);
        await queryInterface.addIndex('study_progress_logs', ['date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_progress_logs');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_progress_logs_resource_type";');
    },
};

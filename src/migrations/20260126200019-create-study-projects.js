'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_projects', {
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
            template_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'study_project_templates',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            name: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true,
                defaultValue: '#3B82F6',
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            deadline: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PLANNED', 'ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PLANNED',
            },
            progress_percentage: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

        await queryInterface.addIndex('study_projects', ['user_id']);
        await queryInterface.addIndex('study_projects', ['status']);
        await queryInterface.addIndex('study_projects', ['deadline']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_projects');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_projects_status";');
    },
};

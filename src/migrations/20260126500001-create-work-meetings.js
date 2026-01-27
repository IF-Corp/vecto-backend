'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_meetings', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
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
            project_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_projects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            start_time: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 60,
            },
            category: {
                type: Sequelize.ENUM('ONE_ON_ONE', 'DAILY', 'PLANNING', 'RETROSPECTIVE', 'CLIENT', 'INTERVIEW', 'OTHER'),
                allowNull: false,
                defaultValue: 'OTHER',
            },
            is_recurring: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            recurrence_type: {
                type: Sequelize.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY'),
                allowNull: true,
            },
            recurrence_end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            location: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            meeting_link: {
                type: Sequelize.STRING(500),
                allowNull: true,
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

        await queryInterface.addIndex('work_meetings', ['user_id']);
        await queryInterface.addIndex('work_meetings', ['project_id']);
        await queryInterface.addIndex('work_meetings', ['start_time']);
        await queryInterface.addIndex('work_meetings', ['category']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_meetings');
    },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('calendar_events', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            is_all_day: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            location: {
                type: Sequelize.STRING,
                allowNull: true
            },
            category: {
                type: Sequelize.ENUM('PERSONAL', 'WORK', 'FAMILY', 'SOCIAL', 'HEALTH', 'OTHER'),
                defaultValue: 'PERSONAL',
                allowNull: false
            },
            recurrence: {
                type: Sequelize.ENUM('NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'),
                defaultValue: 'NONE',
                allowNull: false
            },
            reminder_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            color: {
                type: Sequelize.STRING,
                allowNull: true
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

        await queryInterface.addIndex('calendar_events', ['user_id']);
        await queryInterface.addIndex('calendar_events', ['start_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('calendar_events');
    }
};

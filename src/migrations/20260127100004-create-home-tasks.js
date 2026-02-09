'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_tasks', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            space_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_spaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            frequency: {
                type: Sequelize.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'CUSTOM'),
                allowNull: false,
                defaultValue: 'WEEKLY',
            },
            frequency_days: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                allowNull: true,
                comment: 'Days of week (0-6) or days of month (1-31)',
            },
            custom_interval_days: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'For CUSTOM frequency',
            },
            assigned_member_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            rotation_enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            rotation_members: {
                type: Sequelize.ARRAY(Sequelize.UUID),
                allowNull: true,
            },
            estimated_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            points: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            is_active: {
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

        await queryInterface.addIndex('home_tasks', ['space_id']);
        await queryInterface.addIndex('home_tasks', ['assigned_member_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_tasks');
    },
};

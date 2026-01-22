'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('freeze_mode_config', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            pause_habits: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            pause_tasks: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            pause_notifications: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            auto_resume: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
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

        await queryInterface.addIndex('freeze_mode_config', ['user_id']);
        await queryInterface.addIndex('freeze_mode_config', ['is_active']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('freeze_mode_config');
    }
};

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('notification_config', {
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
            channel: {
                type: Sequelize.ENUM('EMAIL', 'PUSH', 'WHATSAPP'),
                allowNull: false
            },
            alert_type: {
                type: Sequelize.ENUM('REMINDERS', 'WEEKLY_REPORT', 'ACHIEVEMENTS'),
                allowNull: false
            },
            active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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

        await queryInterface.addIndex('notification_config', ['user_id'], {
            name: 'notification_config_user_id_idx'
        });

        await queryInterface.addIndex('notification_config', ['user_id', 'channel', 'alert_type'], {
            name: 'notification_config_unique_idx',
            unique: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('notification_config');
    }
};

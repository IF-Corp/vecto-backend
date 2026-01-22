'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_preferences', {
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
            default_currency: {
                type: Sequelize.ENUM('BRL', 'USD', 'EUR'),
                defaultValue: 'BRL',
                allowNull: false
            },
            timezone: {
                type: Sequelize.STRING,
                defaultValue: 'America/Sao_Paulo',
                allowNull: false
            },
            language: {
                type: Sequelize.STRING,
                defaultValue: 'pt-BR',
                allowNull: false
            },
            date_format: {
                type: Sequelize.ENUM('DD/MM', 'MM/DD'),
                defaultValue: 'DD/MM',
                allowNull: false
            },
            week_start_day: {
                type: Sequelize.ENUM('SUN', 'MON'),
                defaultValue: 'SUN',
                allowNull: false
            },
            theme: {
                type: Sequelize.ENUM('DARK', 'LIGHT', 'SYSTEM'),
                defaultValue: 'SYSTEM',
                allowNull: false
            },
            sounds_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            compact_mode: {
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

        await queryInterface.addIndex('user_preferences', ['user_id'], {
            name: 'user_preferences_user_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_preferences');
    }
};

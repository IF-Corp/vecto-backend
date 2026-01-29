'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Preference Settings
        await queryInterface.createTable('preference_settings', {
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
            language: {
                type: Sequelize.STRING(10),
                defaultValue: 'pt-BR',
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: 'BRL',
            },
            date_format: {
                type: Sequelize.STRING(20),
                defaultValue: 'DD/MM/YYYY',
            },
            time_format: {
                type: Sequelize.ENUM('12h', '24h'),
                defaultValue: '24h',
            },
            week_starts_on: {
                type: Sequelize.INTEGER,
                defaultValue: 0, // 0 = Sunday, 1 = Monday
            },
            timezone: {
                type: Sequelize.STRING(50),
                defaultValue: 'America/Sao_Paulo',
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

        await queryInterface.addIndex('preference_settings', ['user_id'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('preference_settings');
    },
};

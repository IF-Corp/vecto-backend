'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Theme enum
        await queryInterface.sequelize.query(`
            CREATE TYPE theme_type AS ENUM ('LIGHT', 'DARK', 'SYSTEM');
        `);

        // Accent color enum
        await queryInterface.sequelize.query(`
            CREATE TYPE accent_color AS ENUM (
                'BLUE', 'GREEN', 'PURPLE', 'ORANGE', 'PINK',
                'TEAL', 'RED', 'YELLOW'
            );
        `);

        // Appearance Settings
        await queryInterface.createTable('appearance_settings', {
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
            theme: {
                type: 'theme_type',
                defaultValue: 'SYSTEM',
            },
            accent_color: {
                type: 'accent_color',
                defaultValue: 'BLUE',
            },
            compact_mode: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            animations_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            sounds_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            high_contrast: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            font_size: {
                type: Sequelize.ENUM('SMALL', 'MEDIUM', 'LARGE'),
                defaultValue: 'MEDIUM',
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

        await queryInterface.addIndex('appearance_settings', ['user_id'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('appearance_settings');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS theme_type;');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS accent_color;');
    },
};

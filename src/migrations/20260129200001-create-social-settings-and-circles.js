'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Social Settings
        await queryInterface.createTable('social_settings', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            enable_commitments: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            enable_gifts: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            enable_health_score: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            enable_social_battery: {
                type: Sequelize.BOOLEAN,
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

        await queryInterface.addIndex('social_settings', ['user_id'], { unique: true });

        // Social Circles
        await queryInterface.createTable('social_circles', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            color: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            priority: {
                type: Sequelize.ENUM('HIGH', 'MEDIUM', 'LOW'),
                allowNull: false,
                defaultValue: 'MEDIUM',
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            sort_order: {
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

        await queryInterface.addIndex('social_circles', ['user_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('social_circles');
        await queryInterface.dropTable('social_settings');
    },
};

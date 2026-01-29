'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Gifts
        await queryInterface.createTable('social_gifts', {
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
            contact_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'social_contacts', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            gift_type: {
                type: Sequelize.ENUM('GIVEN', 'RECEIVED'),
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            occasion: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_gifts', ['user_id']);
        await queryInterface.addIndex('social_gifts', ['contact_id']);
        await queryInterface.addIndex('social_gifts', ['date']);

        // Gift Ideas
        await queryInterface.createTable('social_gift_ideas', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            contact_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'social_contacts', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            estimated_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            priority: {
                type: Sequelize.ENUM('HIGH', 'MEDIUM', 'LOW'),
                allowNull: false,
                defaultValue: 'MEDIUM',
            },
            is_purchased: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_gift_ideas', ['contact_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('social_gift_ideas');
        await queryInterface.dropTable('social_gifts');
    },
};

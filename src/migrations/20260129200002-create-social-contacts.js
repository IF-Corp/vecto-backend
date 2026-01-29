'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Social Contacts
        await queryInterface.createTable('social_contacts', {
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
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            nickname: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            photo_url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            birthday: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            is_favorite: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            is_active: {
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

        await queryInterface.addIndex('social_contacts', ['user_id']);
        await queryInterface.addIndex('social_contacts', ['birthday']);

        // Contact Circles (many-to-many)
        await queryInterface.createTable('social_contact_circles', {
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
            circle_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'social_circles', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_contact_circles', ['contact_id', 'circle_id'], { unique: true });

        // Contact Social Networks
        await queryInterface.createTable('social_contact_networks', {
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
            network_type: {
                type: Sequelize.ENUM('INSTAGRAM', 'LINKEDIN', 'FACEBOOK', 'TWITTER', 'TIKTOK', 'WHATSAPP', 'TELEGRAM', 'OTHER'),
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_contact_networks', ['contact_id']);

        // Contact Tags
        await queryInterface.createTable('social_contact_tags', {
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
            tag_name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_contact_tags', ['contact_id']);
        await queryInterface.addIndex('social_contact_tags', ['tag_name']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('social_contact_tags');
        await queryInterface.dropTable('social_contact_networks');
        await queryInterface.dropTable('social_contact_circles');
        await queryInterface.dropTable('social_contacts');
    },
};

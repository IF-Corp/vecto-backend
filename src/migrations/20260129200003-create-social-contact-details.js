'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Contact Preferences (food, drink, team, hobbies)
        await queryInterface.createTable('social_contact_preferences', {
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
            preference_type: {
                type: Sequelize.ENUM('FOOD', 'DRINK', 'TEAM', 'HOBBY', 'OTHER'),
                allowNull: false,
            },
            value: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_contact_preferences', ['contact_id']);

        // Contact Restrictions (allergies, etc)
        await queryInterface.createTable('social_contact_restrictions', {
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
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_contact_restrictions', ['contact_id']);

        // Contact Special Dates (wedding, graduation, etc)
        await queryInterface.createTable('social_contact_special_dates', {
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
            date_type: {
                type: Sequelize.ENUM('BIRTHDAY', 'WEDDING', 'GRADUATION', 'ANNIVERSARY', 'OTHER'),
                allowNull: false,
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            remind_yearly: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_contact_special_dates', ['contact_id']);
        await queryInterface.addIndex('social_contact_special_dates', ['date']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('social_contact_special_dates');
        await queryInterface.dropTable('social_contact_restrictions');
        await queryInterface.dropTable('social_contact_preferences');
    },
};

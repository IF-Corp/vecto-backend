'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Contact Reminders (for keeping in touch)
        await queryInterface.createTable('social_contact_reminders', {
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
                unique: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            frequency_type: {
                type: Sequelize.ENUM('WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY', 'CUSTOM'),
                allowNull: false,
                defaultValue: 'MONTHLY',
            },
            frequency_days: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            preferred_contact_type: {
                type: Sequelize.ENUM('ANY', 'IN_PERSON', 'CALL', 'MESSAGE'),
                allowNull: false,
                defaultValue: 'ANY',
            },
            last_interaction_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            last_interaction_type: {
                type: Sequelize.STRING(50),
                allowNull: true,
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

        await queryInterface.addIndex('social_contact_reminders', ['contact_id'], { unique: true });
        await queryInterface.addIndex('social_contact_reminders', ['last_interaction_at']);

        // Interactions History
        await queryInterface.createTable('social_interactions', {
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
            event_id: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            interaction_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            interaction_type: {
                type: Sequelize.ENUM('IN_PERSON', 'CALL', 'VIDEO_CALL', 'MESSAGE'),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_interactions', ['contact_id']);
        await queryInterface.addIndex('social_interactions', ['interaction_date']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('social_interactions');
        await queryInterface.dropTable('social_contact_reminders');
    },
};

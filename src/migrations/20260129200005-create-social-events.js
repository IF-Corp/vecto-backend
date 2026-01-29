'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Social Events
        await queryInterface.createTable('social_events', {
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
            event_type: {
                type: Sequelize.ENUM('PARTY', 'BBQ', 'MEETUP', 'DINNER', 'TRIP', 'BIRTHDAY', 'WEDDING', 'OTHER'),
                allowNull: false,
                defaultValue: 'MEETUP',
            },
            event_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            event_time: {
                type: Sequelize.TIME,
                allowNull: true,
            },
            location_type: {
                type: Sequelize.ENUM('ADDRESS', 'HOME_SPACE', 'ONLINE'),
                allowNull: false,
                defaultValue: 'ADDRESS',
            },
            location_address: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            home_space_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: { model: 'home_spaces', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            estimated_cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            actual_cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PLANNING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PLANNING',
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
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_events', ['user_id']);
        await queryInterface.addIndex('social_events', ['event_date']);
        await queryInterface.addIndex('social_events', ['status']);

        // Event Guests
        await queryInterface.createTable('social_event_guests', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            event_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'social_events', key: 'id' },
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
            status: {
                type: Sequelize.ENUM('INVITED', 'CONFIRMED', 'MAYBE', 'DECLINED'),
                allowNull: false,
                defaultValue: 'INVITED',
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
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_event_guests', ['event_id']);
        await queryInterface.addIndex('social_event_guests', ['contact_id']);
        await queryInterface.addIndex('social_event_guests', ['event_id', 'contact_id'], { unique: true });

        // Event Checklist
        await queryInterface.createTable('social_event_checklist', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            event_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'social_events', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            item: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            is_completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
        });

        await queryInterface.addIndex('social_event_checklist', ['event_id']);
    },

    async down(queryInterface) {
        await queryInterface.dropTable('social_event_checklist');
        await queryInterface.dropTable('social_event_guests');
        await queryInterface.dropTable('social_events');
    },
};

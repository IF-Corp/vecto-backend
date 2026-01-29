'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Professional/Networking fields for contacts
        await queryInterface.createTable('social_contact_professional', {
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
            company: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            job_title: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            industry: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            how_we_met: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            mutual_connections: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            potential_collaboration: {
                type: Sequelize.TEXT,
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
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('social_contact_professional', ['contact_id'], { unique: true });

        // Social Battery Log (for tracking energy levels)
        await queryInterface.createTable('social_battery_log', {
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
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            battery_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 50,
            },
            social_events_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            recharge_time_hours: {
                type: Sequelize.DECIMAL(4, 1),
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

        await queryInterface.addIndex('social_battery_log', ['user_id', 'date'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('social_battery_log');
        await queryInterface.dropTable('social_contact_professional');
    },
};

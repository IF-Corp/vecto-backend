'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Cost split settings table
        await queryInterface.createTable('home_cost_split_settings', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            space_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'home_spaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            split_type: {
                type: Sequelize.ENUM('EQUAL', 'CUSTOM'),
                allowNull: false,
                defaultValue: 'EQUAL',
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

        // Cost split members table (for custom percentages)
        await queryInterface.createTable('home_cost_split_members', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            split_settings_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_cost_split_settings',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            member_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            percentage: {
                type: Sequelize.DECIMAL(5, 2),
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

        await queryInterface.addIndex('home_cost_split_members', ['split_settings_id']);
        await queryInterface.addIndex('home_cost_split_members', ['member_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_cost_split_members');
        await queryInterface.dropTable('home_cost_split_settings');
    },
};

'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Plants table
        await queryInterface.createTable('home_plants', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            space_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_spaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            species: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            location: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            photo_url: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
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

        // Plant care types table
        await queryInterface.createTable('home_plant_care_types', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            plant_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_plants',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            care_type: {
                type: Sequelize.ENUM('WATER', 'FERTILIZE', 'PRUNE', 'REPOT', 'OTHER'),
                allowNull: false,
            },
            frequency_days: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 7,
            },
            last_done_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            next_due_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
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

        // Plant care logs table
        await queryInterface.createTable('home_plant_care_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            care_type_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_plant_care_types',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            done_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            done_by_member_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('home_plants', ['space_id']);
        await queryInterface.addIndex('home_plant_care_types', ['plant_id']);
        await queryInterface.addIndex('home_plant_care_types', ['next_due_at']);
        await queryInterface.addIndex('home_plant_care_logs', ['care_type_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_plant_care_logs');
        await queryInterface.dropTable('home_plant_care_types');
        await queryInterface.dropTable('home_plants');
    },
};

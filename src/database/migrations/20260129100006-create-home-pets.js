'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Pets table
        await queryInterface.createTable('home_pets', {
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
                type: Sequelize.ENUM('DOG', 'CAT', 'BIRD', 'FISH', 'RODENT', 'REPTILE', 'OTHER'),
                allowNull: false,
                defaultValue: 'OTHER',
            },
            breed: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            birth_date: {
                type: Sequelize.DATEONLY,
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

        // Pet care types table
        await queryInterface.createTable('home_pet_care_types', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            pet_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_pets',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            care_type: {
                type: Sequelize.ENUM('VACCINE', 'DEWORMING', 'BATH', 'VET_CHECKUP', 'GROOMING', 'MEDICATION', 'OTHER'),
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            frequency_days: {
                type: Sequelize.INTEGER,
                allowNull: true,
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

        // Pet care logs table
        await queryInterface.createTable('home_pet_care_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            care_type_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_pet_care_types',
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
            provider: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            finance_transaction_id: {
                type: Sequelize.UUID,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('home_pets', ['space_id']);
        await queryInterface.addIndex('home_pet_care_types', ['pet_id']);
        await queryInterface.addIndex('home_pet_care_types', ['next_due_at']);
        await queryInterface.addIndex('home_pet_care_logs', ['care_type_id']);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('home_pet_care_logs');
        await queryInterface.dropTable('home_pet_care_types');
        await queryInterface.dropTable('home_pets');
    },
};

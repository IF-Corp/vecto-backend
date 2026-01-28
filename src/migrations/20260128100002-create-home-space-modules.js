'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_space_modules', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
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
            module_type: {
                type: Sequelize.ENUM('ROUTINE', 'MAINTENANCE', 'SHOPPING', 'STOCK', 'PLANTS', 'PETS', 'MEALS', 'PROJECTS'),
                allowNull: false,
            },
            is_enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            settings: {
                type: Sequelize.JSONB,
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

        await queryInterface.addIndex('home_space_modules', ['space_id']);
        await queryInterface.addIndex('home_space_modules', ['space_id', 'module_type'], { unique: true });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_space_modules');
    },
};

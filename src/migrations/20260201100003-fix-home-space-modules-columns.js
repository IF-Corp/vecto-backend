'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableDescription = await queryInterface.describeTable('home_space_modules');

        // Add is_enabled column if missing
        if (!tableDescription.is_enabled) {
            await queryInterface.addColumn('home_space_modules', 'is_enabled', {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            });
        }

        // Add settings column if missing
        if (!tableDescription.settings) {
            await queryInterface.addColumn('home_space_modules', 'settings', {
                type: Sequelize.JSONB,
                allowNull: true,
            });
        }

        // Add new module types to the enum
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'ROUTINE';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'MAINTENANCE';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'SHOPPING';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'STOCK';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'PLANTS';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'PETS';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'MEALS';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_space_modules_module_type ADD VALUE IF NOT EXISTS 'PROJECTS';
        `);
    },

    async down(queryInterface, Sequelize) {
        const tableDescription = await queryInterface.describeTable('home_space_modules');
        if (tableDescription.is_enabled) {
            await queryInterface.removeColumn('home_space_modules', 'is_enabled');
        }
        if (tableDescription.settings) {
            await queryInterface.removeColumn('home_space_modules', 'settings');
        }
    },
};

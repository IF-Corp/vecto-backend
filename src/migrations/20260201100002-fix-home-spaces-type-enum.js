'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add new enum values to existing enum
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_spaces_type ADD VALUE IF NOT EXISTS 'HOUSE';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_spaces_type ADD VALUE IF NOT EXISTS 'APARTMENT';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_spaces_type ADD VALUE IF NOT EXISTS 'STUDIO';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_spaces_type ADD VALUE IF NOT EXISTS 'ROOM';
        `);
        await queryInterface.sequelize.query(`
            ALTER TYPE enum_home_spaces_type ADD VALUE IF NOT EXISTS 'OTHER';
        `);
    },

    async down(queryInterface, Sequelize) {
        // PostgreSQL doesn't support removing enum values easily
        // This is a no-op for safety
    },
};

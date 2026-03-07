'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            `CREATE TYPE "enum_medications_type" AS ENUM ('MEDICATION', 'SUPPLEMENT');`
        );

        await queryInterface.addColumn('medications', 'type', {
            type: Sequelize.ENUM('MEDICATION', 'SUPPLEMENT'),
            allowNull: false,
            defaultValue: 'MEDICATION'
        });

        await queryInterface.addIndex('medications', ['type']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('medications', ['type']);
        await queryInterface.removeColumn('medications', 'type');
        await queryInterface.sequelize.query(
            `DROP TYPE IF EXISTS "enum_medications_type";`
        );
    }
};

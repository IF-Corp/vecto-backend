'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('accounts', 'brand', {
            type: Sequelize.ENUM('VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER'),
            allowNull: true,
            after: 'type'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('accounts', 'brand');
        // Also drop the ENUM type
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_accounts_brand";');
    }
};

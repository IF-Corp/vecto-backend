'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_warranties', {
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
            item_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            model: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            purchase_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            warranty_until: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            receipt_url: {
                type: Sequelize.STRING,
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

        await queryInterface.addIndex('home_warranties', ['space_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_warranties');
    },
};

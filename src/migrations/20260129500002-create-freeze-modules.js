'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('freeze_modules', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            freeze_period_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'freeze_periods',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            module_type: {
                type: 'module_type',
                allowNull: false
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await queryInterface.addIndex('freeze_modules', ['freeze_period_id']);
        await queryInterface.addIndex('freeze_modules', ['module_type']);

        // Unique constraint: one module type per freeze period
        await queryInterface.addConstraint('freeze_modules', {
            fields: ['freeze_period_id', 'module_type'],
            type: 'unique',
            name: 'unique_freeze_module_type'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('freeze_modules');
    }
};

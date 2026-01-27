'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_key_result_updates', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            key_result_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_key_results',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            previous_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            new_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
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

        await queryInterface.addIndex('work_key_result_updates', ['key_result_id']);
        await queryInterface.addIndex('work_key_result_updates', ['created_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_key_result_updates');
    },
};

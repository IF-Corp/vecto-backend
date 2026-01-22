'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('medication_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            medication_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'medications',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            taken_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('TAKEN', 'SKIPPED', 'MISSED'),
                allowNull: false
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
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

        await queryInterface.addIndex('medication_logs', ['medication_id']);
        await queryInterface.addIndex('medication_logs', ['taken_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('medication_logs');
    }
};

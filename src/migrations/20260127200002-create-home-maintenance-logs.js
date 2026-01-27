'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_maintenance_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            maintenance_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_maintenances',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            done_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            done_by_member_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('home_maintenance_logs', ['maintenance_id']);
        await queryInterface.addIndex('home_maintenance_logs', ['done_by_member_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_maintenance_logs');
    },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('weight_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            weight_kg: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
            },
            body_fat_percentage: {
                type: Sequelize.DECIMAL(4, 1),
                allowNull: true,
            },
            muscle_mass_kg: {
                type: Sequelize.DECIMAL(5, 2),
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

        // Unique constraint: one weight log per user per day
        await queryInterface.addIndex('weight_logs', ['user_id', 'date'], {
            unique: true,
            name: 'weight_logs_user_date_unique',
        });

        // Index for faster lookups
        await queryInterface.addIndex('weight_logs', ['user_id']);
        await queryInterface.addIndex('weight_logs', ['date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('weight_logs');
    },
};

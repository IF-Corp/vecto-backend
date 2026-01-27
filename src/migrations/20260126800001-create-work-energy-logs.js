'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_energy_logs', {
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
            timestamp: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            energy_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 10,
                },
            },
            activity_type: {
                type: Sequelize.ENUM('deep_work', 'meetings', 'admin', 'creative', 'break', 'other'),
                allowNull: true,
            },
            source: {
                type: Sequelize.ENUM('standup', 'end_of_day', 'manual', 'work_mode'),
                allowNull: false,
                defaultValue: 'manual',
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

        // Index for user queries
        await queryInterface.addIndex('work_energy_logs', ['user_id', 'timestamp']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_energy_logs');
    },
};

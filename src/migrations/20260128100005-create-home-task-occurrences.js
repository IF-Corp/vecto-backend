'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_task_occurrences', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            task_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_tasks',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            due_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('PENDING', 'COMPLETED', 'SKIPPED'),
                allowNull: false,
                defaultValue: 'PENDING',
            },
            completed_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            completed_by_member_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'home_members',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('home_task_occurrences', ['task_id']);
        await queryInterface.addIndex('home_task_occurrences', ['due_date']);
        await queryInterface.addIndex('home_task_occurrences', ['task_id', 'due_date'], { unique: true });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_task_occurrences');
    },
};

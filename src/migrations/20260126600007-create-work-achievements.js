'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_achievements', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
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
            title: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_projects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            achievement_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: 'Trophy',
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

        await queryInterface.addIndex('work_achievements', ['user_id']);
        await queryInterface.addIndex('work_achievements', ['project_id']);
        await queryInterface.addIndex('work_achievements', ['achievement_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_achievements');
    },
};

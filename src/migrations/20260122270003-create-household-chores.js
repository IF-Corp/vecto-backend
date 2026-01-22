'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('household_chores', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            frequency: {
                type: Sequelize.ENUM('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'AS_NEEDED'),
                allowNull: false
            },
            assigned_to: {
                type: Sequelize.STRING,
                allowNull: true
            },
            last_completed: {
                type: Sequelize.DATE,
                allowNull: true
            },
            next_due: {
                type: Sequelize.DATE,
                allowNull: true
            },
            room: {
                type: Sequelize.STRING,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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

        await queryInterface.addIndex('household_chores', ['user_id']);
        await queryInterface.addIndex('household_chores', ['is_active']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('household_chores');
    }
};

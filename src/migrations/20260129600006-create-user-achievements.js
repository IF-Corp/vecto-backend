'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_achievements', {
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
            achievement_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'achievements',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            unlocked_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW
            },
            progress: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            is_featured: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
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

        await queryInterface.addIndex('user_achievements', ['user_id']);
        await queryInterface.addIndex('user_achievements', ['achievement_id']);
        await queryInterface.addIndex('user_achievements', ['unlocked_at']);

        // Unique constraint: one achievement per user
        await queryInterface.addConstraint('user_achievements', {
            fields: ['user_id', 'achievement_id'],
            type: 'unique',
            name: 'unique_user_achievement'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_achievements');
    }
};

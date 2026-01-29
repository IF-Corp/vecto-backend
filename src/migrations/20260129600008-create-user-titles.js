'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_titles', {
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
            title_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'titles',
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
            is_active: {
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

        await queryInterface.addIndex('user_titles', ['user_id']);
        await queryInterface.addIndex('user_titles', ['title_id']);
        await queryInterface.addIndex('user_titles', ['is_active']);

        // Unique constraint: one title per user
        await queryInterface.addConstraint('user_titles', {
            fields: ['user_id', 'title_id'],
            type: 'unique',
            name: 'unique_user_title'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_titles');
    }
};

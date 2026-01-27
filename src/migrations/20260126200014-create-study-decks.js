'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_decks', {
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
            name: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true,
                defaultValue: '#3B82F6',
            },
            subject_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'study_subjects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            topic_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'study_topics',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            cards_count: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
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

        await queryInterface.addIndex('study_decks', ['user_id']);
        await queryInterface.addIndex('study_decks', ['subject_id']);
        await queryInterface.addIndex('study_decks', ['topic_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_decks');
    },
};

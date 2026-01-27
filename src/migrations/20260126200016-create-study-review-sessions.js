'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_review_sessions', {
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
            deck_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'study_decks',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            finished_at: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            total_cards: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            cards_reviewed: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            cards_correct: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            score: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'IN_PROGRESS',
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

        await queryInterface.addIndex('study_review_sessions', ['user_id']);
        await queryInterface.addIndex('study_review_sessions', ['deck_id']);
        await queryInterface.addIndex('study_review_sessions', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_review_sessions');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_review_sessions_status";');
    },
};

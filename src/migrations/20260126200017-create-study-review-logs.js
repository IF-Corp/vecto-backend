'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_review_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            session_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_review_sessions',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            flashcard_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_flashcards',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            response_rating: {
                type: Sequelize.ENUM('AGAIN', 'HARD', 'GOOD', 'EASY'),
                allowNull: false,
            },
            time_spent_seconds: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            reviewed_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('study_review_logs', ['session_id']);
        await queryInterface.addIndex('study_review_logs', ['flashcard_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_review_logs');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_review_logs_response_rating";');
    },
};

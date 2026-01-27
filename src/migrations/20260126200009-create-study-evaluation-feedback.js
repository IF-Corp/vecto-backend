'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_evaluation_feedback', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            evaluation_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'study_evaluations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            difficulty_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            confidence_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            mental_state_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            answered_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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

        await queryInterface.addIndex('study_evaluation_feedback', ['evaluation_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_evaluation_feedback');
    },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_evaluation_topics', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            evaluation_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_evaluations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            topic_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_topics',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('study_evaluation_topics', ['evaluation_id']);
        await queryInterface.addIndex('study_evaluation_topics', ['topic_id']);
        await queryInterface.addConstraint('study_evaluation_topics', {
            fields: ['evaluation_id', 'topic_id'],
            type: 'unique',
            name: 'study_evaluation_topics_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_evaluation_topics');
    },
};

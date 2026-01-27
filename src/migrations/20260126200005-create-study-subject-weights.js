'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_subject_weights', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            subject_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_subjects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            evaluation_type: {
                type: Sequelize.ENUM('EXAM_1', 'EXAM_2', 'EXAM_3', 'FINAL_EXAM', 'ASSIGNMENT', 'PROJECT', 'PARTICIPATION', 'OTHER'),
                allowNull: false,
            },
            weight: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
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

        await queryInterface.addIndex('study_subject_weights', ['subject_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_subject_weights');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_subject_weights_evaluation_type";');
    },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_evaluations', {
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
            name: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            weight: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
            },
            grade: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
            },
            max_grade: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
                defaultValue: 10.0,
            },
            status: {
                type: Sequelize.ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'SCHEDULED',
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
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

        await queryInterface.addIndex('study_evaluations', ['subject_id']);
        await queryInterface.addIndex('study_evaluations', ['date']);
        await queryInterface.addIndex('study_evaluations', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_evaluations');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_evaluations_evaluation_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_evaluations_status";');
    },
};

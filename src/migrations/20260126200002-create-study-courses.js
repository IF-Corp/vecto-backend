'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_courses', {
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
            institution: {
                type: Sequelize.STRING(300),
                allowNull: true,
            },
            course_type: {
                type: Sequelize.ENUM('UNDERGRADUATE', 'POSTGRADUATE', 'TECHNICAL', 'OTHER'),
                allowNull: false,
                defaultValue: 'UNDERGRADUATE',
            },
            total_periods: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            min_passing_grade: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: true,
                defaultValue: 6.0,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'COMPLETED', 'PAUSED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
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

        await queryInterface.addIndex('study_courses', ['user_id']);
        await queryInterface.addIndex('study_courses', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_courses');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_courses_course_type";');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_courses_status";');
    },
};

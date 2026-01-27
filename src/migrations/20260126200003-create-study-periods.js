'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_periods', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            course_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_courses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            number: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            target_grade: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'COMPLETED', 'PLANNED'),
                allowNull: false,
                defaultValue: 'PLANNED',
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

        await queryInterface.addIndex('study_periods', ['course_id']);
        await queryInterface.addIndex('study_periods', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_periods');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_periods_status";');
    },
};

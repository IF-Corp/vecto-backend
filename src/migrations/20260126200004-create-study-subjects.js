'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_subjects', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            period_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_periods',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            professor: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            credits: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true,
                defaultValue: '#3B82F6',
            },
            target_grade: {
                type: Sequelize.DECIMAL(4, 2),
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('ACTIVE', 'COMPLETED', 'FAILED', 'DROPPED'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
            final_grade: {
                type: Sequelize.DECIMAL(4, 2),
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

        await queryInterface.addIndex('study_subjects', ['period_id']);
        await queryInterface.addIndex('study_subjects', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_subjects');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_subjects_status";');
    },
};

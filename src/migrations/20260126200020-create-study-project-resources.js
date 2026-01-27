'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_project_resources', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'study_projects',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            resource_type: {
                type: Sequelize.ENUM('BOOK', 'COURSE_ONLINE', 'SUBJECT', 'DECK'),
                allowNull: false,
            },
            resource_id: {
                type: Sequelize.UUID,
                allowNull: false,
            },
            order_index: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('study_project_resources', ['project_id']);
        await queryInterface.addIndex('study_project_resources', ['resource_type', 'resource_id']);
        await queryInterface.addConstraint('study_project_resources', {
            fields: ['project_id', 'resource_type', 'resource_id'],
            type: 'unique',
            name: 'study_project_resources_unique',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_project_resources');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_study_project_resources_resource_type";');
    },
};

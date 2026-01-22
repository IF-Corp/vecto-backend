'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('meeting_history', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'projects',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            actual_duration: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            agenda_description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            documentation_link: {
                type: Sequelize.STRING,
                allowNull: true
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false
            }
        });

        await queryInterface.addIndex('meeting_history', ['project_id'], {
            name: 'meeting_history_project_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('meeting_history');
    }
};

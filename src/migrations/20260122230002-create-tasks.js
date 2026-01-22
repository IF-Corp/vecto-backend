'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tasks', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            project_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'projects',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            category_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            tags: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                defaultValue: [],
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            priority: {
                type: Sequelize.ENUM('HIGH', 'MEDIUM', 'LOW'),
                defaultValue: 'MEDIUM',
                allowNull: false
            },
            scheduled_date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            estimated_duration: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('BACKLOG', 'TODO', 'DOING', 'DONE'),
                defaultValue: 'BACKLOG',
                allowNull: false
            },
            assignees: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                defaultValue: [],
                allowNull: false
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

        await queryInterface.addIndex('tasks', ['user_id'], {
            name: 'tasks_user_id_idx'
        });

        await queryInterface.addIndex('tasks', ['project_id'], {
            name: 'tasks_project_id_idx'
        });

        await queryInterface.addIndex('tasks', ['status'], {
            name: 'tasks_status_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tasks');
    }
};

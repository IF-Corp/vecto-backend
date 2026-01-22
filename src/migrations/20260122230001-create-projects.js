'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('projects', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
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
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('IN_PROGRESS', 'COMPLETED', 'PAUSED'),
                defaultValue: 'IN_PROGRESS',
                allowNull: false
            },
            life_area: {
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

        await queryInterface.addIndex('projects', ['user_id'], {
            name: 'projects_user_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('projects');
    }
};

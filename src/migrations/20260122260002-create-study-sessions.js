'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_sessions', {
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
            subject: {
                type: Sequelize.STRING,
                allowNull: false
            },
            topic: {
                type: Sequelize.STRING,
                allowNull: true
            },
            start_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            end_time: {
                type: Sequelize.DATE,
                allowNull: true
            },
            duration_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            technique: {
                type: Sequelize.ENUM('POMODORO', 'DEEP_WORK', 'ACTIVE_RECALL', 'FREE_STUDY', 'OTHER'),
                allowNull: true
            },
            productivity_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            notes: {
                type: Sequelize.TEXT,
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

        await queryInterface.addIndex('study_sessions', ['user_id']);
        await queryInterface.addIndex('study_sessions', ['start_time']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_sessions');
    }
};

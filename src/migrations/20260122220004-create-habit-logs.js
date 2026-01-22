'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('habit_logs', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            habit_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'habits',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            execution_date: {
                type: Sequelize.DATE,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('DONE', 'FAILED', 'SKIPPED'),
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

        await queryInterface.addIndex('habit_logs', ['habit_id'], {
            name: 'habit_logs_habit_id_idx'
        });

        await queryInterface.addIndex('habit_logs', ['habit_id', 'execution_date'], {
            name: 'habit_logs_habit_date_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('habit_logs');
    }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_end_of_day_reviews', {
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
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            tasks_planned: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            tasks_completed: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            hours_worked: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
            },
            productivity_rating: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
                comment: '1-5 scale: 1=😫, 2=😕, 3=😐, 4=🙂, 5=😎',
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            uncompleted_tasks_moved: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
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

        await queryInterface.addIndex('work_end_of_day_reviews', ['user_id', 'date'], { unique: true });
        await queryInterface.addIndex('work_end_of_day_reviews', ['date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_end_of_day_reviews');
    },
};

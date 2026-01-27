'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_daily_standups', {
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
            energy_level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
                comment: '1-5 scale: 1=😫, 2=😕, 3=😐, 4=🙂, 5=😎',
            },
            has_blockers: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            blocker_description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            notes: {
                type: Sequelize.TEXT,
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

        await queryInterface.addIndex('work_daily_standups', ['user_id', 'date'], { unique: true });
        await queryInterface.addIndex('work_daily_standups', ['date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_daily_standups');
    },
};

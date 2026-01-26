'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('goal_contributions', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            goal_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'finance_goals',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            notes: {
                type: Sequelize.STRING(200),
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

        await queryInterface.addIndex('goal_contributions', ['goal_id'], {
            name: 'goal_contributions_goal_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('goal_contributions');
    }
};

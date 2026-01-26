'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('finance_goals', {
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
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(500),
                allowNull: true
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true
            },
            target_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            current_amount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
                allowNull: false
            },
            deadline: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            priority: {
                type: Sequelize.ENUM('LOW', 'MEDIUM', 'HIGH'),
                defaultValue: 'MEDIUM',
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'PAUSED'),
                defaultValue: 'IN_PROGRESS',
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

        await queryInterface.addIndex('finance_goals', ['user_id'], {
            name: 'finance_goals_user_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('finance_goals');
    }
};

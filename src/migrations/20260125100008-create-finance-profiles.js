'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('finance_profiles', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            investor_profile: {
                type: Sequelize.ENUM('CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'),
                defaultValue: 'MODERATE',
                allowNull: false
            },
            budget_fixed_percent: {
                type: Sequelize.INTEGER,
                defaultValue: 50,
                allowNull: false
            },
            budget_flex_percent: {
                type: Sequelize.INTEGER,
                defaultValue: 30,
                allowNull: false
            },
            budget_invest_percent: {
                type: Sequelize.INTEGER,
                defaultValue: 20,
                allowNull: false
            },
            monthly_income: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true
            },
            alerts_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            weekly_report_enabled: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
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
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('finance_profiles');
    }
};

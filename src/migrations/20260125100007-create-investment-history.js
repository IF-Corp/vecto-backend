'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('investment_history', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            investment_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'investments',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            value: {
                type: Sequelize.DECIMAL(12, 2),
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

        await queryInterface.addIndex('investment_history', ['investment_id'], {
            name: 'investment_history_investment_id_idx'
        });

        await queryInterface.addIndex('investment_history', ['investment_id', 'date'], {
            name: 'investment_history_investment_date_idx',
            unique: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('investment_history');
    }
};

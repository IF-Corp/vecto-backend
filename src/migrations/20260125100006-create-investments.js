'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('investments', {
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
                type: Sequelize.STRING(150),
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM(
                    'CDB', 'LCI', 'LCA', 'TESOURO_SELIC', 'TESOURO_IPCA', 'TESOURO_PREFIXADO', 'POUPANCA',
                    'ACAO', 'FII', 'ETF', 'BDR', 'CRIPTO',
                    'FUNDO_INVESTIMENTO', 'PREVIDENCIA', 'OTHER'
                ),
                allowNull: false
            },
            institution: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            initial_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            current_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false
            },
            rate: {
                type: Sequelize.DECIMAL(8, 4),
                allowNull: true
            },
            rate_type: {
                type: Sequelize.ENUM('CDI', 'IPCA', 'PREFIXADO', 'SELIC', 'OTHER'),
                allowNull: true
            },
            maturity_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            ticker: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            quantity: {
                type: Sequelize.DECIMAL(12, 6),
                allowNull: true
            },
            average_price: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            notes: {
                type: Sequelize.STRING(500),
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

        await queryInterface.addIndex('investments', ['user_id'], {
            name: 'investments_user_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('investments');
    }
};

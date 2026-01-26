'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cards', {
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
            last_digits: {
                type: Sequelize.STRING(4),
                allowNull: false
            },
            brand: {
                type: Sequelize.ENUM('VISA', 'MASTERCARD', 'ELO', 'AMEX', 'HIPERCARD', 'OTHER'),
                allowNull: false
            },
            type: {
                type: Sequelize.ENUM('CREDIT', 'DEBIT', 'BOTH'),
                allowNull: false
            },
            card_limit: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true
            },
            closing_day: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            due_day: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true
            },
            is_active: {
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

        await queryInterface.addIndex('cards', ['user_id'], {
            name: 'cards_user_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cards');
    }
};

'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('invoices', {
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
            card_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'cards',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            reference_month: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            closing_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            due_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            total_amount: {
                type: Sequelize.DECIMAL(12, 2),
                defaultValue: 0,
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('OPEN', 'CLOSED', 'PAID', 'PARTIAL', 'OVERDUE'),
                defaultValue: 'OPEN',
                allowNull: false
            },
            paid_amount: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: true
            },
            paid_at: {
                type: Sequelize.DATE,
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

        await queryInterface.addIndex('invoices', ['user_id'], {
            name: 'invoices_user_id_idx'
        });

        await queryInterface.addIndex('invoices', ['card_id', 'reference_month'], {
            name: 'invoices_card_month_idx',
            unique: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('invoices');
    }
};

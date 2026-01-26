'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Helper to check if column exists
        const columnExists = async (table, column) => {
            const [results] = await queryInterface.sequelize.query(`
                SELECT column_name FROM information_schema.columns
                WHERE table_name = '${table}' AND column_name = '${column}'
            `);
            return results.length > 0;
        };

        // Helper to check if index exists
        const indexExists = async (indexName) => {
            const [results] = await queryInterface.sequelize.query(`
                SELECT indexname FROM pg_indexes WHERE indexname = '${indexName}'
            `);
            return results.length > 0;
        };

        // Add user_id column
        if (!(await columnExists('transactions', 'user_id'))) {
            await queryInterface.addColumn('transactions', 'user_id', {
                type: Sequelize.UUID,
                allowNull: true,
                references: { model: 'users', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            });
        }

        // Add category_id column
        if (!(await columnExists('transactions', 'category_id'))) {
            await queryInterface.addColumn('transactions', 'category_id', {
                type: Sequelize.UUID,
                allowNull: true,
                references: { model: 'finance_categories', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            });
        }

        // Add card_id column
        if (!(await columnExists('transactions', 'card_id'))) {
            await queryInterface.addColumn('transactions', 'card_id', {
                type: Sequelize.UUID,
                allowNull: true,
                references: { model: 'cards', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            });
        }

        // Add invoice_id column
        if (!(await columnExists('transactions', 'invoice_id'))) {
            await queryInterface.addColumn('transactions', 'invoice_id', {
                type: Sequelize.UUID,
                allowNull: true,
                references: { model: 'invoices', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            });
        }

        // Add installment fields
        if (!(await columnExists('transactions', 'is_installment'))) {
            await queryInterface.addColumn('transactions', 'is_installment', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            });
        }

        if (!(await columnExists('transactions', 'installment_id'))) {
            await queryInterface.addColumn('transactions', 'installment_id', {
                type: Sequelize.UUID,
                allowNull: true
            });
        }

        if (!(await columnExists('transactions', 'current_installment'))) {
            await queryInterface.addColumn('transactions', 'current_installment', {
                type: Sequelize.INTEGER,
                allowNull: true
            });
        }

        if (!(await columnExists('transactions', 'total_installments'))) {
            await queryInterface.addColumn('transactions', 'total_installments', {
                type: Sequelize.INTEGER,
                allowNull: true
            });
        }

        // Add recurring fields
        if (!(await columnExists('transactions', 'is_recurring'))) {
            await queryInterface.addColumn('transactions', 'is_recurring', {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            });
        }

        if (!(await columnExists('transactions', 'recurring_id'))) {
            await queryInterface.addColumn('transactions', 'recurring_id', {
                type: Sequelize.UUID,
                allowNull: true
            });
        }

        // Add notes and attachment
        if (!(await columnExists('transactions', 'notes'))) {
            await queryInterface.addColumn('transactions', 'notes', {
                type: Sequelize.STRING(500),
                allowNull: true
            });
        }

        if (!(await columnExists('transactions', 'attachment_url'))) {
            await queryInterface.addColumn('transactions', 'attachment_url', {
                type: Sequelize.STRING(500),
                allowNull: true
            });
        }

        // Add indexes (check if they exist first)
        if (!(await indexExists('transactions_user_id_idx'))) {
            await queryInterface.addIndex('transactions', ['user_id'], { name: 'transactions_user_id_idx' });
        }

        if (!(await indexExists('transactions_user_date_idx'))) {
            await queryInterface.addIndex('transactions', ['user_id', 'transaction_date'], { name: 'transactions_user_date_idx' });
        }

        if (!(await indexExists('transactions_installment_id_idx'))) {
            await queryInterface.addIndex('transactions', ['installment_id'], { name: 'transactions_installment_id_idx' });
        }

        if (!(await indexExists('transactions_recurring_id_idx'))) {
            await queryInterface.addIndex('transactions', ['recurring_id'], { name: 'transactions_recurring_id_idx' });
        }

        // Update status enum to include new values (PostgreSQL requires special handling)
        await queryInterface.sequelize.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum
                    WHERE enumlabel = 'CONSOLIDATED'
                    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_transactions_status')
                ) THEN
                    ALTER TYPE "enum_transactions_status" ADD VALUE 'CONSOLIDATED';
                END IF;
            END$$;
        `);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('transactions', 'transactions_user_id_idx');
        await queryInterface.removeIndex('transactions', 'transactions_user_date_idx');
        await queryInterface.removeIndex('transactions', 'transactions_installment_id_idx');
        await queryInterface.removeIndex('transactions', 'transactions_recurring_id_idx');

        await queryInterface.removeColumn('transactions', 'user_id');
        await queryInterface.removeColumn('transactions', 'category_id');
        await queryInterface.removeColumn('transactions', 'card_id');
        await queryInterface.removeColumn('transactions', 'invoice_id');
        await queryInterface.removeColumn('transactions', 'is_installment');
        await queryInterface.removeColumn('transactions', 'installment_id');
        await queryInterface.removeColumn('transactions', 'current_installment');
        await queryInterface.removeColumn('transactions', 'total_installments');
        await queryInterface.removeColumn('transactions', 'is_recurring');
        await queryInterface.removeColumn('transactions', 'recurring_id');
        await queryInterface.removeColumn('transactions', 'notes');
        await queryInterface.removeColumn('transactions', 'attachment_url');
    }
};

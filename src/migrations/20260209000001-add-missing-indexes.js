'use strict';

module.exports = {
    async up(queryInterface) {
        const addIndexSafe = async (table, columns, options) => {
            try {
                await queryInterface.addIndex(table, columns, options);
            } catch (e) {
                if (e.message && e.message.includes('already exists')) return;
                throw e;
            }
        };

        // CRITICAL: Missing FK indexes
        await addIndexSafe('transactions', ['category_id'], { name: 'idx_transactions_category_id' });
        await addIndexSafe('transactions', ['card_id'], { name: 'idx_transactions_card_id' });
        await addIndexSafe('transactions', ['invoice_id'], { name: 'idx_transactions_invoice_id' });
        await addIndexSafe('routine_execution_items', ['item_id'], { name: 'idx_routine_execution_items_item_id' });

        // PERFORMANCE: Composite indexes for common queries
        await addIndexSafe('transactions', ['account_id', 'transaction_date'], { name: 'idx_transactions_account_date' });
        await addIndexSafe('transactions', ['category_id', 'transaction_date'], { name: 'idx_transactions_category_date' });
        await addIndexSafe('habit_logs', ['habit_id', 'execution_date'], { name: 'idx_habit_logs_habit_date' });
        await addIndexSafe('work_tasks', ['project_id', 'status_id'], { name: 'idx_work_tasks_project_status' });
        await addIndexSafe('work_time_entries', ['user_id', 'project_id', 'started_at'], { name: 'idx_work_time_entries_user_project_date' });
    },

    async down(queryInterface) {
        const removeIndexSafe = async (table, name) => {
            try { await queryInterface.removeIndex(table, name); } catch { /* ignore */ }
        };
        await removeIndexSafe('transactions', 'idx_transactions_category_id');
        await removeIndexSafe('transactions', 'idx_transactions_card_id');
        await removeIndexSafe('transactions', 'idx_transactions_invoice_id');
        await removeIndexSafe('routine_execution_items', 'idx_routine_execution_items_item_id');
        await removeIndexSafe('transactions', 'idx_transactions_account_date');
        await removeIndexSafe('transactions', 'idx_transactions_category_date');
        await removeIndexSafe('habit_logs', 'idx_habit_logs_habit_date');
        await removeIndexSafe('work_tasks', 'idx_work_tasks_project_status');
        await removeIndexSafe('work_time_entries', 'idx_work_time_entries_user_project_date');
    },
};

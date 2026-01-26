'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('finance_categories', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: true,
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
            type: {
                type: Sequelize.ENUM('EXPENSE', 'INCOME'),
                allowNull: false
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
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

        await queryInterface.addIndex('finance_categories', ['user_id'], {
            name: 'finance_categories_user_id_idx'
        });

        // Insert default categories
        const defaultCategories = [
            // Expense categories
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Alimentação', type: 'EXPENSE', icon: 'Utensils', color: '#f97316', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Moradia', type: 'EXPENSE', icon: 'Home', color: '#3b82f6', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Transporte', type: 'EXPENSE', icon: 'Car', color: '#8b5cf6', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Saúde', type: 'EXPENSE', icon: 'Heart', color: '#ef4444', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Educação', type: 'EXPENSE', icon: 'GraduationCap', color: '#06b6d4', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Lazer', type: 'EXPENSE', icon: 'Gamepad2', color: '#ec4899', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Compras', type: 'EXPENSE', icon: 'ShoppingCart', color: '#f59e0b', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Serviços', type: 'EXPENSE', icon: 'Wrench', color: '#6366f1', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Assinaturas', type: 'EXPENSE', icon: 'Repeat', color: '#14b8a6', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Outros', type: 'EXPENSE', icon: 'MoreHorizontal', color: '#6b7280', is_default: true, is_active: true },
            // Income categories
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Salário', type: 'INCOME', icon: 'Briefcase', color: '#10b981', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Freelance', type: 'INCOME', icon: 'Laptop', color: '#22c55e', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Investimentos', type: 'INCOME', icon: 'TrendingUp', color: '#14b8a6', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Presente', type: 'INCOME', icon: 'Gift', color: '#f472b6', is_default: true, is_active: true },
            { id: Sequelize.fn('uuid_generate_v4'), name: 'Outros', type: 'INCOME', icon: 'MoreHorizontal', color: '#6b7280', is_default: true, is_active: true }
        ];

        const now = new Date();
        for (const cat of defaultCategories) {
            await queryInterface.bulkInsert('finance_categories', [{
                id: queryInterface.sequelize.fn('gen_random_uuid'),
                user_id: null,
                name: cat.name,
                type: cat.type,
                icon: cat.icon,
                color: cat.color,
                is_default: cat.is_default,
                is_active: cat.is_active,
                created_at: now,
                updated_at: now
            }]);
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('finance_categories');
    }
};

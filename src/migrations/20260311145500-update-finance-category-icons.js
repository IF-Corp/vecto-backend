'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const mappings = [
            { name: 'Alimentação', icon: '🍱' },
            { name: 'Moradia', icon: '🏠' },
            { name: 'Transporte', icon: '🚗' },
            { name: 'Saúde', icon: '🏥' },
            { name: 'Educação', icon: '🎓' },
            { name: 'Lazer', icon: '🎮' },
            { name: 'Compras', icon: '🛒' },
            { name: 'Serviços', icon: '🛠️' },
            { name: 'Assinaturas', icon: '🔄' },
            { name: 'Outros', icon: '📦' },
            { name: 'Salário', icon: '💰' },
            { name: 'Freelance', icon: '💻' },
            { name: 'Investimentos', icon: '📈' },
            { name: 'Presente', icon: '🎁' }
        ];

        for (const mapping of mappings) {
            await queryInterface.bulkUpdate('finance_categories',
                { icon: mapping.icon },
                { name: mapping.name, is_default: true, user_id: null }
            );
        }
    },

    async down(queryInterface, Sequelize) {
        // Rollback to original Lucide icons if needed
        const mappings = [
            { name: 'Alimentação', icon: 'Utensils' },
            { name: 'Moradia', icon: 'Home' },
            { name: 'Transporte', icon: 'Car' },
            { name: 'Saúde', icon: 'Heart' },
            { name: 'Educação', icon: 'GraduationCap' },
            { name: 'Lazer', icon: 'Gamepad2' },
            { name: 'Compras', icon: 'ShoppingCart' },
            { name: 'Serviços', icon: 'Wrench' },
            { name: 'Assinaturas', icon: 'Repeat' },
            { name: 'Outros', icon: 'MoreHorizontal' },
            { name: 'Salário', icon: 'Briefcase' },
            { name: 'Freelance', icon: 'Laptop' },
            { name: 'Investimentos', icon: 'TrendingUp' },
            { name: 'Presente', icon: 'Gift' }
        ];

        for (const mapping of mappings) {
            await queryInterface.bulkUpdate('finance_categories',
                { icon: mapping.icon },
                { name: mapping.name, is_default: true, user_id: null }
            );
        }
    }
};

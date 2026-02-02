'use strict';

const { v4: uuidv4 } = require('uuid');

const achievements = [
    // ==================== GENERAL ====================
    { code: 'FIRST_LOGIN', name: 'Primeiro Acesso', description: 'Bem-vindo ao VECTO!', category: 'GENERAL', rarity: 'COMMON', icon: '👋', xpReward: 10, conditionType: 'LOGIN_COUNT', conditionValue: 1 },
    { code: 'WEEK_STREAK', name: 'Semana Dedicada', description: 'Acesse o app por 7 dias seguidos', category: 'STREAK', rarity: 'COMMON', icon: '📅', xpReward: 50, conditionType: 'LOGIN_STREAK', conditionValue: 7 },
    { code: 'MONTH_STREAK', name: 'Mês de Foco', description: 'Acesse o app por 30 dias seguidos', category: 'STREAK', rarity: 'RARE', icon: '🔥', xpReward: 200, conditionType: 'LOGIN_STREAK', conditionValue: 30 },
    { code: 'YEAR_STREAK', name: 'Compromisso Anual', description: 'Acesse o app por 365 dias seguidos', category: 'STREAK', rarity: 'LEGENDARY', icon: '🌟', xpReward: 1000, conditionType: 'LOGIN_STREAK', conditionValue: 365 },

    // ==================== HABITS ====================
    { code: 'FIRST_HABIT', name: 'Primeiro Passo', description: 'Crie seu primeiro hábito', category: 'HABITS', rarity: 'COMMON', icon: '🎯', xpReward: 20, conditionType: 'HABIT_CREATE', conditionValue: 1 },
    { code: 'HABIT_5', name: 'Construindo Rotina', description: 'Tenha 5 hábitos ativos', category: 'HABITS', rarity: 'UNCOMMON', icon: '📋', xpReward: 50, conditionType: 'HABIT_COUNT', conditionValue: 5 },
    { code: 'HABIT_7_STREAK', name: 'Uma Semana', description: 'Complete um hábito por 7 dias seguidos', category: 'HABITS', rarity: 'UNCOMMON', icon: '⚡', xpReward: 75, conditionType: 'HABIT_STREAK', conditionValue: 7 },
    { code: 'HABIT_21_STREAK', name: 'Formando Hábito', description: 'Complete um hábito por 21 dias seguidos', category: 'HABITS', rarity: 'RARE', icon: '🏆', xpReward: 150, conditionType: 'HABIT_STREAK', conditionValue: 21 },
    { code: 'HABIT_66_STREAK', name: 'Hábito Automático', description: 'Complete um hábito por 66 dias seguidos', category: 'HABITS', rarity: 'EPIC', icon: '💎', xpReward: 300, conditionType: 'HABIT_STREAK', conditionValue: 66 },
    { code: 'HABIT_100_COMPLETE', name: 'Centenário', description: 'Complete 100 registros de hábitos', category: 'HABITS', rarity: 'RARE', icon: '💯', xpReward: 200, conditionType: 'HABIT_LOG_COUNT', conditionValue: 100 },
    { code: 'HABIT_1000_COMPLETE', name: 'Mestre dos Hábitos', description: 'Complete 1000 registros de hábitos', category: 'HABITS', rarity: 'LEGENDARY', icon: '👑', xpReward: 500, conditionType: 'HABIT_LOG_COUNT', conditionValue: 1000 },

    // ==================== TASKS ====================
    { code: 'FIRST_TASK', name: 'Lista Começada', description: 'Complete sua primeira tarefa', category: 'TASKS', rarity: 'COMMON', icon: '✅', xpReward: 15, conditionType: 'TASK_COMPLETE', conditionValue: 1 },
    { code: 'TASK_10', name: 'Produtivo', description: 'Complete 10 tarefas', category: 'TASKS', rarity: 'COMMON', icon: '📝', xpReward: 40, conditionType: 'TASK_COMPLETE', conditionValue: 10 },
    { code: 'TASK_50', name: 'Executor', description: 'Complete 50 tarefas', category: 'TASKS', rarity: 'UNCOMMON', icon: '⚡', xpReward: 100, conditionType: 'TASK_COMPLETE', conditionValue: 50 },
    { code: 'TASK_100', name: 'Máquina de Fazer', description: 'Complete 100 tarefas', category: 'TASKS', rarity: 'RARE', icon: '🚀', xpReward: 200, conditionType: 'TASK_COMPLETE', conditionValue: 100 },
    { code: 'TASK_500', name: 'Imparável', description: 'Complete 500 tarefas', category: 'TASKS', rarity: 'EPIC', icon: '🔥', xpReward: 400, conditionType: 'TASK_COMPLETE', conditionValue: 500 },
    { code: 'TASK_1000', name: 'Lenda da Produtividade', description: 'Complete 1000 tarefas', category: 'TASKS', rarity: 'LEGENDARY', icon: '🌟', xpReward: 750, conditionType: 'TASK_COMPLETE', conditionValue: 1000 },
    { code: 'TASK_P1_COMPLETE', name: 'Prioridade Máxima', description: 'Complete uma tarefa P1', category: 'TASKS', rarity: 'COMMON', icon: '🎯', xpReward: 25, conditionType: 'TASK_P1_COMPLETE', conditionValue: 1 },
    { code: 'TASK_P1_10', name: 'Foco no Importante', description: 'Complete 10 tarefas P1', category: 'TASKS', rarity: 'UNCOMMON', icon: '💪', xpReward: 80, conditionType: 'TASK_P1_COMPLETE', conditionValue: 10 },

    // ==================== FINANCE ====================
    { code: 'FIRST_TRANSACTION', name: 'Primeira Anotação', description: 'Registre sua primeira transação', category: 'FINANCE', rarity: 'COMMON', icon: '💰', xpReward: 15, conditionType: 'TRANSACTION_COUNT', conditionValue: 1 },
    { code: 'BUDGET_CREATED', name: 'Planejador', description: 'Crie seu primeiro orçamento', category: 'FINANCE', rarity: 'COMMON', icon: '📊', xpReward: 25, conditionType: 'BUDGET_CREATE', conditionValue: 1 },
    { code: 'BUDGET_MET', name: 'Dentro do Orçamento', description: 'Fique dentro do orçamento por 1 mês', category: 'FINANCE', rarity: 'UNCOMMON', icon: '✨', xpReward: 75, conditionType: 'BUDGET_MET', conditionValue: 1 },
    { code: 'BUDGET_3_MONTHS', name: 'Disciplina Financeira', description: 'Fique dentro do orçamento por 3 meses seguidos', category: 'FINANCE', rarity: 'RARE', icon: '💎', xpReward: 200, conditionType: 'BUDGET_MET_STREAK', conditionValue: 3 },
    { code: 'GOAL_CREATED', name: 'Sonhador', description: 'Crie sua primeira meta financeira', category: 'FINANCE', rarity: 'COMMON', icon: '🎯', xpReward: 20, conditionType: 'GOAL_CREATE', conditionValue: 1 },
    { code: 'GOAL_ACHIEVED', name: 'Meta Alcançada', description: 'Alcance uma meta financeira', category: 'FINANCE', rarity: 'RARE', icon: '🏆', xpReward: 150, conditionType: 'GOAL_COMPLETE', conditionValue: 1 },
    { code: 'TRANSACTION_100', name: 'Rastreador Financeiro', description: 'Registre 100 transações', category: 'FINANCE', rarity: 'UNCOMMON', icon: '📈', xpReward: 100, conditionType: 'TRANSACTION_COUNT', conditionValue: 100 },

    // ==================== HEALTH ====================
    { code: 'FIRST_WORKOUT', name: 'Corpo em Movimento', description: 'Registre seu primeiro treino', category: 'HEALTH', rarity: 'COMMON', icon: '🏋️', xpReward: 20, conditionType: 'WORKOUT_COUNT', conditionValue: 1 },
    { code: 'WORKOUT_10', name: 'Fitness Starter', description: 'Complete 10 treinos', category: 'HEALTH', rarity: 'UNCOMMON', icon: '💪', xpReward: 75, conditionType: 'WORKOUT_COUNT', conditionValue: 10 },
    { code: 'WORKOUT_50', name: 'Atleta', description: 'Complete 50 treinos', category: 'HEALTH', rarity: 'RARE', icon: '🏃', xpReward: 200, conditionType: 'WORKOUT_COUNT', conditionValue: 50 },
    { code: 'SLEEP_TRACKED', name: 'Sono Monitorado', description: 'Registre seu sono pela primeira vez', category: 'HEALTH', rarity: 'COMMON', icon: '😴', xpReward: 15, conditionType: 'SLEEP_LOG', conditionValue: 1 },
    { code: 'SLEEP_7_DAYS', name: 'Rotina de Sono', description: 'Registre seu sono por 7 dias seguidos', category: 'HEALTH', rarity: 'UNCOMMON', icon: '🌙', xpReward: 60, conditionType: 'SLEEP_STREAK', conditionValue: 7 },
    { code: 'WEIGHT_TRACKED', name: 'Acompanhamento', description: 'Registre seu peso pela primeira vez', category: 'HEALTH', rarity: 'COMMON', icon: '⚖️', xpReward: 15, conditionType: 'WEIGHT_LOG', conditionValue: 1 },

    // ==================== STUDIES ====================
    { code: 'FIRST_STUDY', name: 'Aprendiz', description: 'Complete sua primeira sessão de estudo', category: 'STUDIES', rarity: 'COMMON', icon: '📚', xpReward: 20, conditionType: 'STUDY_SESSION', conditionValue: 1 },
    { code: 'STUDY_10_HOURS', name: 'Estudioso', description: 'Acumule 10 horas de estudo', category: 'STUDIES', rarity: 'UNCOMMON', icon: '📖', xpReward: 80, conditionType: 'STUDY_HOURS', conditionValue: 10 },
    { code: 'STUDY_50_HOURS', name: 'Dedicação Acadêmica', description: 'Acumule 50 horas de estudo', category: 'STUDIES', rarity: 'RARE', icon: '🎓', xpReward: 200, conditionType: 'STUDY_HOURS', conditionValue: 50 },
    { code: 'STUDY_100_HOURS', name: 'Scholar', description: 'Acumule 100 horas de estudo', category: 'STUDIES', rarity: 'EPIC', icon: '🏛️', xpReward: 350, conditionType: 'STUDY_HOURS', conditionValue: 100 },
    { code: 'FLASHCARD_MASTER', name: 'Memória de Elefante', description: 'Revise 500 flashcards', category: 'STUDIES', rarity: 'RARE', icon: '🧠', xpReward: 150, conditionType: 'FLASHCARD_REVIEW', conditionValue: 500 },
    { code: 'BOOK_FINISHED', name: 'Leitor', description: 'Termine um livro', category: 'STUDIES', rarity: 'UNCOMMON', icon: '📕', xpReward: 75, conditionType: 'BOOK_COMPLETE', conditionValue: 1 },
    { code: 'BOOK_10', name: 'Bibliófilo', description: 'Termine 10 livros', category: 'STUDIES', rarity: 'EPIC', icon: '📚', xpReward: 300, conditionType: 'BOOK_COMPLETE', conditionValue: 10 },

    // ==================== WORK ====================
    { code: 'FIRST_WORK_TASK', name: 'Profissional', description: 'Complete sua primeira tarefa de trabalho', category: 'WORK', rarity: 'COMMON', icon: '💼', xpReward: 20, conditionType: 'WORK_TASK_COMPLETE', conditionValue: 1 },
    { code: 'WORK_PROJECT', name: 'Gerente de Projeto', description: 'Complete um projeto de trabalho', category: 'WORK', rarity: 'RARE', icon: '📂', xpReward: 150, conditionType: 'WORK_PROJECT_COMPLETE', conditionValue: 1 },
    { code: 'FOCUS_1_HOUR', name: 'Foco Total', description: 'Complete 1 hora de foco profundo', category: 'WORK', rarity: 'COMMON', icon: '🎯', xpReward: 30, conditionType: 'FOCUS_MINUTES', conditionValue: 60 },
    { code: 'FOCUS_10_HOURS', name: 'Concentração', description: 'Acumule 10 horas de foco profundo', category: 'WORK', rarity: 'UNCOMMON', icon: '⏱️', xpReward: 100, conditionType: 'FOCUS_MINUTES', conditionValue: 600 },
    { code: 'FOCUS_50_HOURS', name: 'Mestre do Foco', description: 'Acumule 50 horas de foco profundo', category: 'WORK', rarity: 'EPIC', icon: '🔥', xpReward: 300, conditionType: 'FOCUS_MINUTES', conditionValue: 3000 },

    // ==================== HOME ====================
    { code: 'FIRST_CHORE', name: 'Lar Organizado', description: 'Complete sua primeira tarefa doméstica', category: 'HOME', rarity: 'COMMON', icon: '🏠', xpReward: 15, conditionType: 'CHORE_COMPLETE', conditionValue: 1 },
    { code: 'CHORE_50', name: 'Dono(a) de Casa', description: 'Complete 50 tarefas domésticas', category: 'HOME', rarity: 'UNCOMMON', icon: '🧹', xpReward: 100, conditionType: 'CHORE_COMPLETE', conditionValue: 50 },
    { code: 'SHOPPING_COMPLETE', name: 'Compras Feitas', description: 'Complete uma lista de compras', category: 'HOME', rarity: 'COMMON', icon: '🛒', xpReward: 20, conditionType: 'SHOPPING_COMPLETE', conditionValue: 1 },

    // ==================== SOCIAL ====================
    { code: 'FIRST_CONTACT', name: 'Networking', description: 'Adicione seu primeiro contato', category: 'SOCIAL', rarity: 'COMMON', icon: '👥', xpReward: 15, conditionType: 'CONTACT_ADD', conditionValue: 1 },
    { code: 'CONTACT_50', name: 'Social', description: 'Tenha 50 contatos cadastrados', category: 'SOCIAL', rarity: 'UNCOMMON', icon: '📱', xpReward: 75, conditionType: 'CONTACT_COUNT', conditionValue: 50 },
    { code: 'EVENT_CREATED', name: 'Organizador', description: 'Crie seu primeiro evento', category: 'SOCIAL', rarity: 'COMMON', icon: '📅', xpReward: 20, conditionType: 'EVENT_CREATE', conditionValue: 1 },

    // ==================== MILESTONES ====================
    { code: 'LEVEL_5', name: 'Subindo de Nível', description: 'Alcance o nível 5', category: 'MILESTONES', rarity: 'UNCOMMON', icon: '⭐', xpReward: 100, conditionType: 'LEVEL_REACH', conditionValue: 5 },
    { code: 'LEVEL_10', name: 'Dedicado', description: 'Alcance o nível 10', category: 'MILESTONES', rarity: 'RARE', icon: '🌟', xpReward: 250, conditionType: 'LEVEL_REACH', conditionValue: 10 },
    { code: 'LEVEL_15', name: 'Iluminado', description: 'Alcance o nível máximo', category: 'MILESTONES', rarity: 'LEGENDARY', icon: '🌈', xpReward: 500, conditionType: 'LEVEL_REACH', conditionValue: 15 },
    { code: 'ACHIEVEMENT_10', name: 'Colecionador', description: 'Desbloqueie 10 conquistas', category: 'MILESTONES', rarity: 'UNCOMMON', icon: '🏅', xpReward: 100, conditionType: 'ACHIEVEMENT_COUNT', conditionValue: 10 },
    { code: 'ACHIEVEMENT_25', name: 'Conquistador', description: 'Desbloqueie 25 conquistas', category: 'MILESTONES', rarity: 'RARE', icon: '🎖️', xpReward: 200, conditionType: 'ACHIEVEMENT_COUNT', conditionValue: 25 },
    { code: 'ACHIEVEMENT_50', name: 'Completista', description: 'Desbloqueie 50 conquistas', category: 'MILESTONES', rarity: 'EPIC', icon: '🏆', xpReward: 400, conditionType: 'ACHIEVEMENT_COUNT', conditionValue: 50 },
    { code: 'ALL_MODULES', name: 'Explorador Total', description: 'Ative todos os módulos do VECTO', category: 'MILESTONES', rarity: 'EPIC', icon: '🌍', xpReward: 300, conditionType: 'MODULE_ACTIVATE', conditionValue: 8 },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const records = achievements.map(a => ({
            id: uuidv4(),
            code: a.code,
            name: a.name,
            description: a.description,
            category: a.category,
            rarity: a.rarity,
            icon: a.icon,
            xp_reward: a.xpReward,
            condition_type: a.conditionType,
            condition_value: a.conditionValue,
            is_hidden: a.isHidden || false,
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('achievements', records, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('achievements', null, {});
    }
};

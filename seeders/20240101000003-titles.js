'use strict';

const { v4: uuidv4 } = require('uuid');

const titles = [
    // ==================== LEVEL-BASED ====================
    { code: 'NEWBIE', name: 'Novato', description: 'Primeiro título ao começar sua jornada', rarity: 'COMMON', unlockCondition: 'Começar no VECTO', requiredLevel: 1 },
    { code: 'APPRENTICE', name: 'Aprendiz', description: 'Você está aprendendo os caminhos', rarity: 'COMMON', unlockCondition: 'Alcançar nível 2', requiredLevel: 2 },
    { code: 'EXPLORER', name: 'Explorador', description: 'Descobrindo as possibilidades', rarity: 'COMMON', unlockCondition: 'Alcançar nível 3', requiredLevel: 3 },
    { code: 'PRACTITIONER', name: 'Praticante', description: 'Praticando diariamente', rarity: 'UNCOMMON', unlockCondition: 'Alcançar nível 4', requiredLevel: 4 },
    { code: 'DEDICATED', name: 'Dedicado', description: 'Seu comprometimento é admirável', rarity: 'UNCOMMON', unlockCondition: 'Alcançar nível 5', requiredLevel: 5 },
    { code: 'SKILLED', name: 'Habilidoso', description: 'Demonstrando habilidade excepcional', rarity: 'RARE', unlockCondition: 'Alcançar nível 7', requiredLevel: 7 },
    { code: 'MASTER', name: 'Mestre', description: 'Domínio completo das práticas', rarity: 'RARE', unlockCondition: 'Alcançar nível 10', requiredLevel: 10 },
    { code: 'GRANDMASTER', name: 'Grão-Mestre', description: 'Poucos alcançam esse nível', rarity: 'EPIC', unlockCondition: 'Alcançar nível 11', requiredLevel: 11 },
    { code: 'LEGEND', name: 'Lenda', description: 'Uma lenda viva do VECTO', rarity: 'EPIC', unlockCondition: 'Alcançar nível 12', requiredLevel: 12 },
    { code: 'MYTHIC', name: 'Mítico', description: 'Transcendendo o comum', rarity: 'LEGENDARY', unlockCondition: 'Alcançar nível 13', requiredLevel: 13 },
    { code: 'ILLUMINATED', name: 'Iluminado', description: 'A luz da sabedoria brilha em você', rarity: 'LEGENDARY', unlockCondition: 'Alcançar nível máximo', requiredLevel: 15 },

    // ==================== ACHIEVEMENT-BASED ====================
    { code: 'HABIT_BUILDER', name: 'Construtor de Hábitos', description: 'Mestre em criar e manter hábitos', rarity: 'RARE', unlockCondition: 'Conquista: Hábito Automático', requiredLevel: null },
    { code: 'PRODUCTIVITY_KING', name: 'Rei da Produtividade', description: 'Nada escapa da sua lista de tarefas', rarity: 'EPIC', unlockCondition: 'Conquista: Lenda da Produtividade', requiredLevel: null },
    { code: 'FINANCE_GURU', name: 'Guru Financeiro', description: 'Suas finanças estão sob controle', rarity: 'RARE', unlockCondition: 'Conquista: Disciplina Financeira', requiredLevel: null },
    { code: 'FITNESS_CHAMPION', name: 'Campeão Fitness', description: 'Corpo e mente em equilíbrio', rarity: 'RARE', unlockCondition: 'Conquista: Atleta', requiredLevel: null },
    { code: 'SCHOLAR', name: 'Erudito', description: 'O conhecimento é sua maior arma', rarity: 'EPIC', unlockCondition: 'Conquista: Scholar', requiredLevel: null },
    { code: 'FOCUS_MASTER', name: 'Mestre do Foco', description: 'Concentração inabalável', rarity: 'EPIC', unlockCondition: 'Conquista: Mestre do Foco', requiredLevel: null },

    // ==================== STREAK-BASED ====================
    { code: 'PERSISTENT', name: 'Persistente', description: 'A consistência é sua força', rarity: 'UNCOMMON', unlockCondition: 'Conquista: Semana Dedicada', requiredLevel: null },
    { code: 'UNSTOPPABLE', name: 'Imparável', description: 'Nada te detém', rarity: 'RARE', unlockCondition: 'Conquista: Mês de Foco', requiredLevel: null },
    { code: 'ETERNAL', name: 'Eterno', description: 'Sua dedicação é eterna', rarity: 'LEGENDARY', unlockCondition: 'Conquista: Compromisso Anual', requiredLevel: null },

    // ==================== SPECIAL ====================
    { code: 'COMPLETIST', name: 'Completista', description: 'Você coleciona conquistas como troféus', rarity: 'EPIC', unlockCondition: 'Conquista: Completista', requiredLevel: null },
    { code: 'ALL_ROUNDER', name: 'Polivalente', description: 'Domina todos os aspectos da vida', rarity: 'LEGENDARY', unlockCondition: 'Conquista: Explorador Total', requiredLevel: null },
    { code: 'EARLY_ADOPTER', name: 'Early Adopter', description: 'Um dos primeiros a embarcar nessa jornada', rarity: 'LEGENDARY', unlockCondition: 'Usuário desde o lançamento', requiredLevel: null },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const records = titles.map(t => ({
            id: uuidv4(),
            code: t.code,
            name: t.name,
            description: t.description,
            rarity: t.rarity,
            unlock_condition: t.unlockCondition,
            required_level: t.requiredLevel,
            required_achievement_id: null, // Will be linked manually or via code
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('titles', records, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('titles', null, {});
    }
};

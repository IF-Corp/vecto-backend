'use strict';

const { v4: uuidv4 } = require('uuid');

const levels = [
    { level: 1, name: 'Iniciante', minXp: 0, maxXp: 99, icon: '🌱' },
    { level: 2, name: 'Aprendiz', minXp: 100, maxXp: 249, icon: '📚' },
    { level: 3, name: 'Explorador', minXp: 250, maxXp: 499, icon: '🧭' },
    { level: 4, name: 'Praticante', minXp: 500, maxXp: 999, icon: '⚡' },
    { level: 5, name: 'Dedicado', minXp: 1000, maxXp: 1999, icon: '💪' },
    { level: 6, name: 'Competente', minXp: 2000, maxXp: 3499, icon: '🎯' },
    { level: 7, name: 'Habilidoso', minXp: 3500, maxXp: 5499, icon: '🏆' },
    { level: 8, name: 'Especialista', minXp: 5500, maxXp: 7999, icon: '⭐' },
    { level: 9, name: 'Expert', minXp: 8000, maxXp: 11999, icon: '🌟' },
    { level: 10, name: 'Mestre', minXp: 12000, maxXp: 17499, icon: '👑' },
    { level: 11, name: 'Grão-Mestre', minXp: 17500, maxXp: 24999, icon: '💎' },
    { level: 12, name: 'Lenda', minXp: 25000, maxXp: 34999, icon: '🔥' },
    { level: 13, name: 'Mítico', minXp: 35000, maxXp: 49999, icon: '🌠' },
    { level: 14, name: 'Transcendente', minXp: 50000, maxXp: 74999, icon: '✨' },
    { level: 15, name: 'Iluminado', minXp: 75000, maxXp: 999999, icon: '🌈' },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const now = new Date();

        const records = levels.map(level => ({
            id: uuidv4(),
            level: level.level,
            name: level.name,
            min_xp: level.minXp,
            max_xp: level.maxXp,
            icon: level.icon,
            created_at: now,
            updated_at: now,
        }));

        await queryInterface.bulkInsert('xp_levels', records, {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('xp_levels', null, {});
    }
};

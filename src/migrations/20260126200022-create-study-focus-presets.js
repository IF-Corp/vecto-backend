'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('study_focus_presets', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING(300),
                allowNull: true,
            },
            block_minutes: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            short_break_minutes: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            long_break_minutes: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            blocks_until_long_break: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 4,
            },
            is_system: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Seed default presets
        await queryInterface.bulkInsert('study_focus_presets', [
            {
                id: 'a0000000-0000-0000-0000-000000000001',
                name: 'Pomodoro',
                description: 'Técnica clássica: 25 minutos de foco, 5 de pausa',
                block_minutes: 25,
                short_break_minutes: 5,
                long_break_minutes: 15,
                blocks_until_long_break: 4,
                is_system: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'a0000000-0000-0000-0000-000000000002',
                name: 'Deep Work',
                description: 'Blocos longos para trabalho profundo: 50 min foco, 10 pausa',
                block_minutes: 50,
                short_break_minutes: 10,
                long_break_minutes: 30,
                blocks_until_long_break: 3,
                is_system: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'a0000000-0000-0000-0000-000000000003',
                name: 'Ultralearning',
                description: 'Sessões intensas: 90 min foco, 20 pausa',
                block_minutes: 90,
                short_break_minutes: 20,
                long_break_minutes: 45,
                blocks_until_long_break: 2,
                is_system: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('study_focus_presets');
    },
};

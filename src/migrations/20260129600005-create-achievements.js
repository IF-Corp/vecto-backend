'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create achievement_category enum
        await queryInterface.sequelize.query(`
            CREATE TYPE achievement_category AS ENUM (
                'HABITS',
                'TASKS',
                'FINANCE',
                'HEALTH',
                'STUDIES',
                'WORK',
                'SOCIAL',
                'HOME',
                'GENERAL',
                'STREAK',
                'MILESTONES'
            );
        `);

        // Create achievement_rarity enum
        await queryInterface.sequelize.query(`
            CREATE TYPE achievement_rarity AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');
        `);

        await queryInterface.createTable('achievements', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            code: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            category: {
                type: 'achievement_category',
                allowNull: false
            },
            rarity: {
                type: 'achievement_rarity',
                allowNull: false,
                defaultValue: 'COMMON'
            },
            icon: {
                type: Sequelize.STRING(10),
                allowNull: true
            },
            xp_reward: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 50
            },
            condition_type: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            condition_value: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            is_hidden: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false
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

        await queryInterface.addIndex('achievements', ['code']);
        await queryInterface.addIndex('achievements', ['category']);
        await queryInterface.addIndex('achievements', ['rarity']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('achievements');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS achievement_rarity;');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS achievement_category;');
    }
};

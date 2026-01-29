'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create title_rarity enum
        await queryInterface.sequelize.query(`
            CREATE TYPE title_rarity AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');
        `);

        await queryInterface.createTable('titles', {
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
                type: Sequelize.STRING(50),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            rarity: {
                type: 'title_rarity',
                allowNull: false,
                defaultValue: 'COMMON'
            },
            unlock_condition: {
                type: Sequelize.STRING,
                allowNull: true
            },
            required_level: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            required_achievement_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'achievements',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
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

        await queryInterface.addIndex('titles', ['code']);
        await queryInterface.addIndex('titles', ['rarity']);
        await queryInterface.addIndex('titles', ['required_level']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('titles');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS title_rarity;');
    }
};

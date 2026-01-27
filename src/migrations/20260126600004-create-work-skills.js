'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create skill level enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE skill_level AS ENUM ('BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_skills', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            category: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            current_level: {
                type: Sequelize.ENUM('BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
                allowNull: false,
                defaultValue: 'BEGINNER',
            },
            target_level: {
                type: Sequelize.ENUM('BEGINNER', 'BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'),
                allowNull: false,
                defaultValue: 'INTERMEDIATE',
            },
            icon: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            color: {
                type: Sequelize.STRING(7),
                allowNull: true,
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

        await queryInterface.addIndex('work_skills', ['user_id']);
        await queryInterface.addIndex('work_skills', ['category']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_skills');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS skill_level;');
    },
};

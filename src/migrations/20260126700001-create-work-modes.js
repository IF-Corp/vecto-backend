'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create notification_level enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE notification_level AS ENUM ('silent', 'minimal', 'normal');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_modes', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
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
            icon: {
                type: Sequelize.STRING(50),
                allowNull: false,
                defaultValue: '🎯',
            },
            description: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            suggested_duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 50,
                comment: 'Duration in minutes',
            },
            min_duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Minimum duration in minutes',
            },
            max_duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Maximum duration in minutes',
            },
            notification_level: {
                type: Sequelize.ENUM('silent', 'minimal', 'normal'),
                allowNull: false,
                defaultValue: 'minimal',
            },
            break_duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 10,
                comment: 'Break duration in minutes',
            },
            is_default: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            is_system: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                comment: 'System modes cannot be deleted',
            },
            color: {
                type: Sequelize.STRING(20),
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

        await queryInterface.addIndex('work_modes', ['user_id']);
        await queryInterface.addIndex('work_modes', ['is_default']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_modes');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS notification_level;');
    },
};

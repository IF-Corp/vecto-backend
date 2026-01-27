'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create metric type enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE metric_type AS ENUM ('NUMERIC', 'PERCENTAGE', 'BINARY');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_key_results', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            objective_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_objectives',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            description: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            metric_type: {
                type: Sequelize.ENUM('NUMERIC', 'PERCENTAGE', 'BINARY'),
                allowNull: false,
                defaultValue: 'NUMERIC',
            },
            start_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            target_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            current_value: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            unit: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            progress: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: false,
                defaultValue: 0,
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

        await queryInterface.addIndex('work_key_results', ['objective_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_key_results');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS metric_type;');
    },
};

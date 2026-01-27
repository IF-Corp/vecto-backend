'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create contract_status enum
        await queryInterface.sequelize.query(`
            DO $$ BEGIN
                CREATE TYPE contract_status AS ENUM ('ACTIVE', 'INACTIVE', 'PROSPECTING');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        `);

        await queryInterface.createTable('work_clients', {
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
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            company: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            contact_name: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING(50),
                allowNull: true,
            },
            hourly_rate: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            contract_status: {
                type: Sequelize.ENUM('ACTIVE', 'INACTIVE', 'PROSPECTING'),
                allowNull: false,
                defaultValue: 'ACTIVE',
            },
            payment_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            communication_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            scope_rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            notes: {
                type: Sequelize.TEXT,
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

        // Add indexes
        await queryInterface.addIndex('work_clients', ['user_id']);
        await queryInterface.addIndex('work_clients', ['contract_status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_clients');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS contract_status;');
    },
};

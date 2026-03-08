'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Make account_id nullable (model says allowNull: true but DB has NOT NULL)
        await queryInterface.sequelize.query(`
            ALTER TABLE transactions ALTER COLUMN account_id DROP NOT NULL
        `);

        // 2. Add missing status enum values
        // PostgreSQL requires special handling for adding enum values
        await queryInterface.sequelize.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum
                    WHERE enumlabel = 'CONFIRMED'
                    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_transactions_status')
                ) THEN
                    ALTER TYPE "enum_transactions_status" ADD VALUE 'CONFIRMED';
                END IF;
            END$$;
        `);

        await queryInterface.sequelize.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM pg_enum
                    WHERE enumlabel = 'CANCELLED'
                    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_transactions_status')
                ) THEN
                    ALTER TYPE "enum_transactions_status" ADD VALUE 'CANCELLED';
                END IF;
            END$$;
        `);

        // 3. Update default status from 'PENDING' to 'CONFIRMED' for the column
        await queryInterface.changeColumn('transactions', 'status', {
            type: Sequelize.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'CONSOLIDATED'),
            defaultValue: 'CONFIRMED',
            allowNull: false,
        });
    },

    async down(queryInterface, Sequelize) {
        // Revert account_id to NOT NULL
        await queryInterface.changeColumn('transactions', 'account_id', {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
                model: 'accounts',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        });

        // Revert status default
        await queryInterface.changeColumn('transactions', 'status', {
            type: Sequelize.ENUM('PENDING', 'CONSOLIDATED'),
            defaultValue: 'PENDING',
            allowNull: false,
        });
    },
};

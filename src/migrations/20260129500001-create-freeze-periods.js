'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Create freeze_status enum
        await queryInterface.sequelize.query(`
            CREATE TYPE freeze_status AS ENUM ('SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED');
        `);

        // Create freeze_reason enum
        await queryInterface.sequelize.query(`
            CREATE TYPE freeze_reason AS ENUM ('VACATION', 'TRAVEL', 'ILLNESS', 'INTENSE_PROJECT', 'MENTAL_REST', 'OTHER');
        `);

        await queryInterface.createTable('freeze_periods', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            reason: {
                type: 'freeze_reason',
                allowNull: true
            },
            reason_custom: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            status: {
                type: 'freeze_status',
                allowNull: false,
                defaultValue: 'SCHEDULED'
            },
            activated_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            deactivated_at: {
                type: Sequelize.DATE,
                allowNull: true
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

        await queryInterface.addIndex('freeze_periods', ['user_id']);
        await queryInterface.addIndex('freeze_periods', ['status']);
        await queryInterface.addIndex('freeze_periods', ['start_date', 'end_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('freeze_periods');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS freeze_status;');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS freeze_reason;');
    }
};

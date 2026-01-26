'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('health_profiles', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            sex: {
                type: Sequelize.ENUM('male', 'female', 'other'),
                allowNull: true,
            },
            height_cm: {
                type: Sequelize.DECIMAL(5, 1),
                allowNull: true,
            },
            activity_level: {
                type: Sequelize.ENUM('sedentary', 'light', 'moderate', 'active', 'very_active'),
                allowNull: true,
                defaultValue: 'moderate',
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

        // Index for faster lookups by user
        await queryInterface.addIndex('health_profiles', ['user_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('health_profiles');
    },
};

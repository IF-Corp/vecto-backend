'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('diets', {
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
            name: {
                type: Sequelize.STRING(200),
                allowNull: false
            },
            goal: {
                type: Sequelize.ENUM('LOSE_WEIGHT', 'MAINTAIN', 'GAIN_MUSCLE', 'CUSTOM'),
                allowNull: false
            },
            daily_calories_target: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            protein_target: {
                type: Sequelize.DECIMAL(5, 1),
                allowNull: true
            },
            carbs_target: {
                type: Sequelize.DECIMAL(5, 1),
                allowNull: true
            },
            fat_target: {
                type: Sequelize.DECIMAL(5, 1),
                allowNull: true
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            end_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false
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

        await queryInterface.addIndex('diets', ['user_id']);
        await queryInterface.addIndex('diets', ['is_active']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('diets');
    }
};

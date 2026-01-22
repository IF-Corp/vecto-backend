'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('onboarding_state', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                unique: true,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false
            },
            current_step: {
                type: Sequelize.STRING,
                allowNull: true
            },
            selected_modules: {
                type: Sequelize.JSONB,
                defaultValue: [],
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

        await queryInterface.addIndex('onboarding_state', ['user_id'], {
            name: 'onboarding_state_user_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('onboarding_state');
    }
};

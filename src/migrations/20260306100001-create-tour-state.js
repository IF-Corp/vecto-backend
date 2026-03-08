'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tour_state', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
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
            app_tour_completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            app_tour_current_step: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
            completed_page_tours: {
                type: Sequelize.JSONB,
                defaultValue: [],
                allowNull: false,
            },
            skipped_tours: {
                type: Sequelize.JSONB,
                defaultValue: [],
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });

        await queryInterface.addIndex('tour_state', ['user_id'], {
            unique: true,
            name: 'tour_state_user_id_idx',
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tour_state');
    },
};

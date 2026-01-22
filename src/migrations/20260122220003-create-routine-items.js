'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('routine_items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            routine_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'routines',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            habit_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'habits',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            execution_order: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
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

        await queryInterface.addIndex('routine_items', ['routine_id'], {
            name: 'routine_items_routine_id_idx'
        });

        await queryInterface.addIndex('routine_items', ['habit_id'], {
            name: 'routine_items_habit_id_idx'
        });

        await queryInterface.addIndex('routine_items', ['routine_id', 'habit_id'], {
            name: 'routine_items_unique_idx',
            unique: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('routine_items');
    }
};

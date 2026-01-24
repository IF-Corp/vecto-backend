'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Create routine_executions table for focus mode history
        await queryInterface.createTable('routine_executions', {
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
            execution_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            started_at: {
                type: Sequelize.DATE,
                allowNull: false
            },
            completed_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            total_duration: {
                type: Sequelize.INTEGER,
                allowNull: true,
                comment: 'Total duration in seconds'
            },
            completed: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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

        // Create routine_execution_items table for individual item times
        await queryInterface.createTable('routine_execution_items', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            execution_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'routine_executions',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            item_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'routine_items',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            item_title: {
                type: Sequelize.STRING(200),
                allowNull: false,
                comment: 'Snapshot of item title at execution time'
            },
            duration: {
                type: Sequelize.INTEGER,
                allowNull: false,
                comment: 'Duration in seconds'
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

        // Add indexes
        await queryInterface.addIndex('routine_executions', ['routine_id'], {
            name: 'routine_executions_routine_id_idx'
        });

        await queryInterface.addIndex('routine_executions', ['routine_id', 'execution_date'], {
            name: 'routine_executions_routine_date_idx'
        });

        await queryInterface.addIndex('routine_execution_items', ['execution_id'], {
            name: 'routine_execution_items_execution_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('routine_execution_items');
        await queryInterface.dropTable('routine_executions');
    }
};

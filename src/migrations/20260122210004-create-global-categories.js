'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('global_categories', {
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
                type: Sequelize.STRING,
                allowNull: false
            },
            color_hex: {
                type: Sequelize.STRING(7),
                allowNull: true
            },
            icon: {
                type: Sequelize.STRING,
                allowNull: true
            },
            type: {
                type: Sequelize.ENUM('TAG', 'CONTEXT', 'AREA'),
                allowNull: false,
                defaultValue: 'TAG'
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

        await queryInterface.addIndex('global_categories', ['user_id'], {
            name: 'global_categories_user_id_idx'
        });

        await queryInterface.addIndex('global_categories', ['user_id', 'name'], {
            name: 'global_categories_user_name_idx',
            unique: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('global_categories');
    }
};

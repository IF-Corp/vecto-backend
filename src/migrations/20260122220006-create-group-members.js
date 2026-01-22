'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('group_members', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            group_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'social_groups',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
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
            current_score: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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

        await queryInterface.addIndex('group_members', ['group_id'], {
            name: 'group_members_group_id_idx'
        });

        await queryInterface.addIndex('group_members', ['user_id'], {
            name: 'group_members_user_id_idx'
        });

        await queryInterface.addIndex('group_members', ['group_id', 'user_id'], {
            name: 'group_members_unique_idx',
            unique: true
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('group_members');
    }
};

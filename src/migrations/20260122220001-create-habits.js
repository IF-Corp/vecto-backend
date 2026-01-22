'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('habits', {
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
            context_tags: {
                type: Sequelize.ARRAY(Sequelize.STRING),
                defaultValue: [],
                allowNull: false
            },
            ideal_time: {
                type: Sequelize.TIME,
                allowNull: true
            },
            frequency: {
                type: Sequelize.ENUM('DAILY', 'WEEKLY', 'CUSTOM'),
                defaultValue: 'DAILY',
                allowNull: false
            },
            frequency_days: {
                type: Sequelize.ARRAY(Sequelize.INTEGER),
                defaultValue: [],
                allowNull: true
            },
            current_streak: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            is_frozen: {
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

        await queryInterface.addIndex('habits', ['user_id'], {
            name: 'habits_user_id_idx'
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('habits');
    }
};

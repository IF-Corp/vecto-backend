'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('user_profiles', {
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
            photo_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            bio: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true
            },
            location: {
                type: Sequelize.STRING,
                allowNull: true
            },
            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            timezone: {
                type: Sequelize.STRING(50),
                allowNull: true,
                defaultValue: 'America/Sao_Paulo'
            },
            gamification_enabled: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true
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

        await queryInterface.addIndex('user_profiles', ['user_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('user_profiles');
    }
};

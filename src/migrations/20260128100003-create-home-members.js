'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('home_members', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            space_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'home_spaces',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            profile: {
                type: Sequelize.ENUM('ADULT', 'TEENAGER', 'CHILD', 'ELDERLY', 'NO_PARTICIPATION'),
                allowNull: false,
                defaultValue: 'ADULT',
            },
            avatar_url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            birth_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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

        await queryInterface.addIndex('home_members', ['space_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('home_members');
    },
};

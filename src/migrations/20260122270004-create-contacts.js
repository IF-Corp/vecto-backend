'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('contacts', {
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
            email: {
                type: Sequelize.STRING,
                allowNull: true
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true
            },
            relationship: {
                type: Sequelize.ENUM('FAMILY', 'FRIEND', 'WORK', 'ACQUAINTANCE', 'OTHER'),
                allowNull: true
            },
            birthday: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            address: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            company: {
                type: Sequelize.STRING,
                allowNull: true
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            photo_url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            is_favorite: {
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

        await queryInterface.addIndex('contacts', ['user_id']);
        await queryInterface.addIndex('contacts', ['is_favorite']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('contacts');
    }
};

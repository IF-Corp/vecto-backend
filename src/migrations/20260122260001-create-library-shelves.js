'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('library_shelves', {
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
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            author: {
                type: Sequelize.STRING,
                allowNull: true
            },
            type: {
                type: Sequelize.ENUM('BOOK', 'ARTICLE', 'COURSE', 'VIDEO', 'PODCAST', 'OTHER'),
                allowNull: false
            },
            status: {
                type: Sequelize.ENUM('TO_READ', 'READING', 'COMPLETED', 'ABANDONED'),
                defaultValue: 'TO_READ',
                allowNull: false
            },
            current_page: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            total_pages: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            rating: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 1,
                    max: 5
                }
            },
            start_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            finish_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            cover_url: {
                type: Sequelize.STRING,
                allowNull: true
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

        await queryInterface.addIndex('library_shelves', ['user_id']);
        await queryInterface.addIndex('library_shelves', ['status']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('library_shelves');
    }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('spaced_reviews', {
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
            subject: {
                type: Sequelize.STRING,
                allowNull: false
            },
            topic: {
                type: Sequelize.STRING,
                allowNull: false
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            ease_factor: {
                type: Sequelize.DECIMAL(4, 2),
                defaultValue: 2.5,
                allowNull: false
            },
            interval_days: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
                allowNull: false
            },
            repetitions: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false
            },
            next_review_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
            },
            last_review_date: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            last_quality: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    min: 0,
                    max: 5
                }
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

        await queryInterface.addIndex('spaced_reviews', ['user_id']);
        await queryInterface.addIndex('spaced_reviews', ['next_review_date']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('spaced_reviews');
    }
};

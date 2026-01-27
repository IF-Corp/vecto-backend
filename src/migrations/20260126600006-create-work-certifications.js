'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_certifications', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            issuer: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            obtained_at: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            expires_at: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            credential_id: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            credential_url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            skill_id: {
                type: Sequelize.UUID,
                allowNull: true,
                references: {
                    model: 'work_skills',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
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

        await queryInterface.addIndex('work_certifications', ['user_id']);
        await queryInterface.addIndex('work_certifications', ['skill_id']);
        await queryInterface.addIndex('work_certifications', ['expires_at']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_certifications');
    },
};

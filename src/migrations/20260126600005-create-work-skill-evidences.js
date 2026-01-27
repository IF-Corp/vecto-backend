'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('work_skill_evidences', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            skill_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: {
                    model: 'work_skills',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            evidence_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex('work_skill_evidences', ['skill_id']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('work_skill_evidences');
    },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('xp_levels', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
                allowNull: false
            },
            level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            min_xp: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            max_xp: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            icon: {
                type: Sequelize.STRING(10),
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

        await queryInterface.addIndex('xp_levels', ['level']);
        await queryInterface.addIndex('xp_levels', ['min_xp']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('xp_levels');
    }
};

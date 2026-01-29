'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Module types enum
        await queryInterface.sequelize.query(`
            CREATE TYPE module_type AS ENUM (
                'HABITS', 'TASKS', 'FINANCE', 'HEALTH', 'STUDIES',
                'WORK', 'SOCIAL', 'HOME'
            );
        `);

        // User Modules
        await queryInterface.createTable('user_modules', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'users', key: 'id' },
                onDelete: 'CASCADE',
            },
            module_type: {
                type: 'module_type',
                allowNull: false,
            },
            is_active: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });

        await queryInterface.addIndex('user_modules', ['user_id']);
        await queryInterface.addIndex('user_modules', ['user_id', 'module_type'], { unique: true });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('user_modules');
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS module_type;');
    },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add Google SSO fields to users table
        await queryInterface.addColumn('users', 'google_id', {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        });

        await queryInterface.addColumn('users', 'auth_provider', {
            type: Sequelize.ENUM('email', 'google'),
            defaultValue: 'email',
            allowNull: false
        });

        // Add enabled_modules field to user_preferences table
        await queryInterface.addColumn('user_preferences', 'enabled_modules', {
            type: Sequelize.JSONB,
            defaultValue: ['habits', 'projects', 'finance', 'health', 'study', 'home'],
            allowNull: false
        });

        // Create index for google_id for faster lookups
        await queryInterface.addIndex('users', ['google_id'], {
            name: 'users_google_id_idx',
            where: {
                google_id: {
                    [Sequelize.Op.ne]: null
                }
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeIndex('users', 'users_google_id_idx');
        await queryInterface.removeColumn('user_preferences', 'enabled_modules');
        await queryInterface.removeColumn('users', 'auth_provider');
        await queryInterface.removeColumn('users', 'google_id');

        // Drop the ENUM type
        await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_auth_provider";');
    }
};

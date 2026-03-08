'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableDesc = await queryInterface.describeTable('study_projects');

        // 1. Add project_type ENUM column (if not exists)
        if (!tableDesc.project_type) {
            await queryInterface.sequelize.query(`
                DO $$ BEGIN
                    CREATE TYPE "enum_study_projects_project_type" AS ENUM ('CUSTOM', 'CERTIFICATION', 'SKILL', 'CAREER', 'EXAM');
                EXCEPTION WHEN duplicate_object THEN NULL;
                END $$;
            `);
            await queryInterface.addColumn('study_projects', 'project_type', {
                type: Sequelize.ENUM('CUSTOM', 'CERTIFICATION', 'SKILL', 'CAREER', 'EXAM'),
                allowNull: false,
                defaultValue: 'CUSTOM',
            });
        }

        // 2. Add goal column (if not exists)
        if (!tableDesc.goal) {
            await queryInterface.addColumn('study_projects', 'goal', {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }

        // 3. Rename deadline → target_date (if deadline still exists)
        if (tableDesc.deadline && !tableDesc.target_date) {
            await queryInterface.renameColumn('study_projects', 'deadline', 'target_date');
        }

        // 4. Update status enum values (if old values still exist)
        const [statusEnums] = await queryInterface.sequelize.query(
            `SELECT enumlabel FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid WHERE t.typname = 'enum_study_projects_status'`,
        );
        const labels = statusEnums.map((e) => e.enumlabel);

        if (labels.includes('PLANNED')) {
            await queryInterface.sequelize.query(
                `ALTER TYPE "enum_study_projects_status" RENAME VALUE 'PLANNED' TO 'PLANNING';`,
            );
        }
        if (labels.includes('ACTIVE')) {
            await queryInterface.sequelize.query(
                `ALTER TYPE "enum_study_projects_status" RENAME VALUE 'ACTIVE' TO 'IN_PROGRESS';`,
            );
        }
        if (labels.includes('PAUSED')) {
            await queryInterface.sequelize.query(
                `ALTER TYPE "enum_study_projects_status" RENAME VALUE 'PAUSED' TO 'ON_HOLD';`,
            );
        }

        // 5. Update the default value for status column
        await queryInterface.sequelize.query(
            `ALTER TABLE "study_projects" ALTER COLUMN "status" SET DEFAULT 'PLANNING'::enum_study_projects_status;`,
        );

        // 6. Ensure indexes exist
        await queryInterface.removeIndex('study_projects', ['deadline']).catch(() => {});
        await queryInterface.addIndex('study_projects', ['target_date']).catch(() => {});
        await queryInterface.addIndex('study_projects', ['project_type']).catch(() => {});
    },

    async down(queryInterface, Sequelize) {
        // Reverse status enum
        await queryInterface.sequelize.query(
            `ALTER TYPE "enum_study_projects_status" RENAME VALUE 'PLANNING' TO 'PLANNED';`,
        );
        await queryInterface.sequelize.query(
            `ALTER TYPE "enum_study_projects_status" RENAME VALUE 'IN_PROGRESS' TO 'ACTIVE';`,
        );
        await queryInterface.sequelize.query(
            `ALTER TYPE "enum_study_projects_status" RENAME VALUE 'ON_HOLD' TO 'PAUSED';`,
        );

        await queryInterface.sequelize.query(
            `ALTER TABLE "study_projects" ALTER COLUMN "status" SET DEFAULT 'PLANNED'::enum_study_projects_status;`,
        );

        // Rename target_date back to deadline
        await queryInterface.renameColumn('study_projects', 'target_date', 'deadline');

        // Remove goal column
        await queryInterface.removeColumn('study_projects', 'goal');

        // Remove project_type column and enum
        await queryInterface.removeColumn('study_projects', 'project_type');
        await queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_study_projects_project_type";',
        );

        // Restore indexes
        await queryInterface.removeIndex('study_projects', ['target_date']).catch(() => {});
        await queryInterface.removeIndex('study_projects', ['project_type']).catch(() => {});
        await queryInterface.addIndex('study_projects', ['deadline']);
    },
};

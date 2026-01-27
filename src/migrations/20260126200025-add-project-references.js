'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Add foreign key reference to study_books.project_id
        await queryInterface.addConstraint('study_books', {
            fields: ['project_id'],
            type: 'foreign key',
            name: 'study_books_project_id_fkey',
            references: {
                table: 'study_projects',
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        // Add foreign key reference to study_courses_online.project_id
        await queryInterface.addConstraint('study_courses_online', {
            fields: ['project_id'],
            type: 'foreign key',
            name: 'study_courses_online_project_id_fkey',
            references: {
                table: 'study_projects',
                field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        });

        // Seed project templates
        await queryInterface.bulkInsert('study_project_templates', [
            {
                id: 'b0000000-0000-0000-0000-000000000001',
                name: 'Preparação para Certificação',
                description: 'Template para estudar e se preparar para uma certificação profissional',
                default_milestones: JSON.stringify([
                    { name: 'Fundamentos', order: 1 },
                    { name: 'Conceitos Intermediários', order: 2 },
                    { name: 'Conceitos Avançados', order: 3 },
                    { name: 'Prática com Simulados', order: 4 },
                    { name: 'Revisão Final', order: 5 },
                ]),
                estimated_duration_weeks: 12,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000002',
                name: 'Aprender Nova Tecnologia',
                description: 'Template para aprender uma nova linguagem, framework ou ferramenta',
                default_milestones: JSON.stringify([
                    { name: 'Configuração do Ambiente', order: 1 },
                    { name: 'Conceitos Básicos', order: 2 },
                    { name: 'Primeiro Projeto Prático', order: 3 },
                    { name: 'Conceitos Avançados', order: 4 },
                    { name: 'Projeto Final', order: 5 },
                ]),
                estimated_duration_weeks: 8,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000003',
                name: 'Concurso Público',
                description: 'Template para preparação de concursos públicos',
                default_milestones: JSON.stringify([
                    { name: 'Análise do Edital', order: 1 },
                    { name: 'Matérias Básicas', order: 2 },
                    { name: 'Matérias Específicas', order: 3 },
                    { name: 'Resolução de Questões', order: 4 },
                    { name: 'Simulados Completos', order: 5 },
                    { name: 'Revisão Final', order: 6 },
                ]),
                estimated_duration_weeks: 24,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 'b0000000-0000-0000-0000-000000000004',
                name: 'Leitura de Livro Técnico',
                description: 'Template para estudar um livro técnico de forma aprofundada',
                default_milestones: JSON.stringify([
                    { name: 'Primeira Leitura (Visão Geral)', order: 1 },
                    { name: 'Leitura Detalhada + Anotações', order: 2 },
                    { name: 'Criação de Flashcards', order: 3 },
                    { name: 'Prática e Exercícios', order: 4 },
                    { name: 'Revisão e Consolidação', order: 5 },
                ]),
                estimated_duration_weeks: 6,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint('study_books', 'study_books_project_id_fkey');
        await queryInterface.removeConstraint('study_courses_online', 'study_courses_online_project_id_fkey');
        await queryInterface.bulkDelete('study_project_templates', {
            id: {
                [Sequelize.Op.in]: [
                    'b0000000-0000-0000-0000-000000000001',
                    'b0000000-0000-0000-0000-000000000002',
                    'b0000000-0000-0000-0000-000000000003',
                    'b0000000-0000-0000-0000-000000000004',
                ],
            },
        });
    },
};

const homeProjectController = require('../controllers/homeProjectController');

async function homeProjectRoutes(fastify, options) {
    // Projects CRUD
    fastify.get(
        '/users/:userId/spaces/:spaceId/projects',
        homeProjectController.getProjects
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/projects/:projectId',
        homeProjectController.getProject
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/projects',
        homeProjectController.createProject
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/projects/:projectId',
        homeProjectController.updateProject
    );

    fastify.delete(
        '/users/:userId/spaces/:spaceId/projects/:projectId',
        homeProjectController.deleteProject
    );

    // Project Tasks
    fastify.get(
        '/users/:userId/spaces/:spaceId/projects/:projectId/tasks',
        homeProjectController.getProjectTasks
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/projects/:projectId/tasks',
        homeProjectController.createProjectTask
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/projects/:projectId/tasks/:taskId',
        homeProjectController.updateProjectTask
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/projects/:projectId/tasks/:taskId/complete',
        homeProjectController.completeProjectTask
    );

    fastify.delete(
        '/users/:userId/spaces/:spaceId/projects/:projectId/tasks/:taskId',
        homeProjectController.deleteProjectTask
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/projects/:projectId/tasks/reorder',
        homeProjectController.reorderProjectTasks
    );
}

module.exports = homeProjectRoutes;

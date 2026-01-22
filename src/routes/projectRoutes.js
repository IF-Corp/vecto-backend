const projectController = require('../controllers/projectController');

async function projectRoutes(fastify, options) {
    // ==================== PROJECTS ====================
    fastify.get('/users/:userId/projects', projectController.getProjects);
    fastify.post('/users/:userId/projects', projectController.createProject);
    fastify.put('/projects/:id', projectController.updateProject);
    fastify.delete('/projects/:id', projectController.deleteProject);

    // ==================== TASKS ====================
    fastify.get('/users/:userId/tasks', projectController.getTasks);
    fastify.post('/users/:userId/tasks', projectController.createTask);
    fastify.put('/tasks/:id', projectController.updateTask);
    fastify.delete('/tasks/:id', projectController.deleteTask);

    // ==================== MEETINGS ====================
    fastify.get('/projects/:projectId/meetings', projectController.getMeetings);
    fastify.post('/projects/:projectId/meetings', projectController.createMeeting);
    fastify.delete('/meetings/:id', projectController.deleteMeeting);
}

module.exports = projectRoutes;

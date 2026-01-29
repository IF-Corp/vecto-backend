const socialCircleController = require('../controllers/socialCircleController');

async function routes(fastify) {
    fastify.get('/users/:userId/social/circles', socialCircleController.getCircles);
    fastify.post('/users/:userId/social/circles', socialCircleController.createCircle);
    fastify.put('/users/:userId/social/circles/reorder', socialCircleController.reorderCircles);
    fastify.get('/social/circles/:id', socialCircleController.getCircle);
    fastify.put('/social/circles/:id', socialCircleController.updateCircle);
    fastify.delete('/social/circles/:id', socialCircleController.deleteCircle);
}

module.exports = routes;

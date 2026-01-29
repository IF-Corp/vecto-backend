const socialInteractionController = require('../controllers/socialInteractionController');

async function routes(fastify) {
    fastify.get('/users/:userId/social/commitments', socialInteractionController.getContactsNeedingAttention);
    fastify.get('/social/contacts/:contactId/interactions', socialInteractionController.getInteractions);
    fastify.post('/social/contacts/:contactId/interactions', socialInteractionController.createInteraction);
    fastify.delete('/social/interactions/:id', socialInteractionController.deleteInteraction);
}

module.exports = routes;

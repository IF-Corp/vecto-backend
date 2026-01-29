const socialGiftController = require('../controllers/socialGiftController');

async function routes(fastify) {
    fastify.get('/users/:userId/social/gifts', socialGiftController.getGifts);
    fastify.post('/users/:userId/social/gifts', socialGiftController.createGift);
    fastify.delete('/social/gifts/:id', socialGiftController.deleteGift);

    // Gift Ideas
    fastify.get('/social/contacts/:contactId/gift-ideas', socialGiftController.getGiftIdeas);
    fastify.post('/social/contacts/:contactId/gift-ideas', socialGiftController.createGiftIdea);
    fastify.put('/social/gift-ideas/:ideaId', socialGiftController.updateGiftIdea);
    fastify.post('/social/gift-ideas/:ideaId/purchase', socialGiftController.markIdeaAsPurchased);
    fastify.delete('/social/gift-ideas/:ideaId', socialGiftController.deleteGiftIdea);
}

module.exports = routes;

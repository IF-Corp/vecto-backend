const socialEventController = require('../controllers/socialEventController');

async function routes(fastify) {
    fastify.get('/users/:userId/social/events', socialEventController.getEvents);
    fastify.post('/users/:userId/social/events', socialEventController.createEvent);
    fastify.get('/social/events/:id', socialEventController.getEvent);
    fastify.put('/social/events/:id', socialEventController.updateEvent);
    fastify.delete('/social/events/:id', socialEventController.deleteEvent);
    fastify.post('/social/events/:id/complete', socialEventController.completeEvent);

    // Guests
    fastify.post('/social/events/:eventId/guests', socialEventController.addGuest);
    fastify.put('/social/event-guests/:guestId', socialEventController.updateGuestStatus);
    fastify.delete('/social/event-guests/:guestId', socialEventController.removeGuest);

    // Checklist
    fastify.post('/social/events/:eventId/checklist', socialEventController.addChecklistItem);
    fastify.post('/social/event-checklist/:itemId/toggle', socialEventController.toggleChecklistItem);
}

module.exports = routes;

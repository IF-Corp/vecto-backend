const socialContactController = require('../controllers/socialContactController');

async function routes(fastify) {
    fastify.get('/users/:userId/social/contacts', socialContactController.getContacts);
    fastify.post('/users/:userId/social/contacts', socialContactController.createContact);
    fastify.get('/users/:userId/social/contacts/birthdays', socialContactController.getUpcomingBirthdays);
    fastify.get('/social/contacts/:id', socialContactController.getContact);
    fastify.put('/social/contacts/:id', socialContactController.updateContact);
    fastify.delete('/social/contacts/:id', socialContactController.deleteContact);
    fastify.post('/social/contacts/:id/toggle-favorite', socialContactController.toggleFavorite);
    fastify.put('/social/contacts/:id/notes', socialContactController.updateContactNotes);
    fastify.put('/social/contacts/:id/reminder', socialContactController.updateContactReminder);
}

module.exports = routes;

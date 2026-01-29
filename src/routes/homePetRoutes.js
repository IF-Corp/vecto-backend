const homePetController = require('../controllers/homePetController');

async function homePetRoutes(fastify, options) {
    // Pets CRUD
    fastify.get(
        '/users/:userId/spaces/:spaceId/pets',
        homePetController.getPets
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/pets/schedule',
        homePetController.getPetCareSchedule
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/pets/:petId',
        homePetController.getPet
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/pets/:petId/expenses',
        homePetController.getPetExpenses
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/pets',
        homePetController.createPet
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/pets/:petId',
        homePetController.updatePet
    );

    fastify.delete(
        '/users/:userId/spaces/:spaceId/pets/:petId',
        homePetController.deletePet
    );

    // Pet care types
    fastify.post(
        '/users/:userId/spaces/:spaceId/pets/:petId/care-types',
        homePetController.addPetCareType
    );

    // Pet care completion
    fastify.post(
        '/users/:userId/spaces/:spaceId/pets/:petId/care/:careTypeId/complete',
        homePetController.completePetCare
    );
}

module.exports = homePetRoutes;

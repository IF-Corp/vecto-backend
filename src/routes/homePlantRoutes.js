const homePlantController = require('../controllers/homePlantController');

async function homePlantRoutes(fastify, options) {
    // Plants CRUD
    fastify.get(
        '/users/:userId/spaces/:spaceId/plants',
        homePlantController.getPlants
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/plants/needing-care',
        homePlantController.getPlantsNeedingCare
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/plants/schedule',
        homePlantController.getPlantCareSchedule
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/plants/:plantId',
        homePlantController.getPlant
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/plants',
        homePlantController.createPlant
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/plants/:plantId',
        homePlantController.updatePlant
    );

    fastify.delete(
        '/users/:userId/spaces/:spaceId/plants/:plantId',
        homePlantController.deletePlant
    );

    // Plant care
    fastify.post(
        '/users/:userId/spaces/:spaceId/plants/:plantId/care/:careType/complete',
        homePlantController.completePlantCare
    );
}

module.exports = homePlantRoutes;

const homeMealController = require('../controllers/homeMealController');

async function homeMealRoutes(fastify, options) {
    // Meal Plans
    fastify.get(
        '/users/:userId/spaces/:spaceId/meal-plans',
        homeMealController.getMealPlan
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/meal-plans/:mealPlanId/meals',
        homeMealController.updateMeal
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/meal-plans/:mealPlanId/copy-previous',
        homeMealController.copyPreviousWeek
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/meal-plans/:mealPlanId/generate-shopping-list',
        homeMealController.generateShoppingList
    );

    // Recipes
    fastify.get(
        '/users/:userId/spaces/:spaceId/recipes',
        homeMealController.getRecipes
    );

    fastify.get(
        '/users/:userId/spaces/:spaceId/recipes/:recipeId',
        homeMealController.getRecipe
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/recipes',
        homeMealController.createRecipe
    );

    fastify.put(
        '/users/:userId/spaces/:spaceId/recipes/:recipeId',
        homeMealController.updateRecipe
    );

    fastify.delete(
        '/users/:userId/spaces/:spaceId/recipes/:recipeId',
        homeMealController.deleteRecipe
    );

    fastify.post(
        '/users/:userId/spaces/:spaceId/recipes/:recipeId/toggle-favorite',
        homeMealController.toggleRecipeFavorite
    );
}

module.exports = homeMealRoutes;

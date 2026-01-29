const HomeMealPlan = require('../models/HomeMealPlan');
const HomeMeal = require('../models/HomeMeal');
const HomeRecipe = require('../models/HomeRecipe');
const { Op } = require('sequelize');

// Get meal plan for a week
const getMealPlan = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { weekStart } = request.query;

        // Calculate week start (Monday) if not provided
        let targetWeekStart;
        if (weekStart) {
            targetWeekStart = new Date(weekStart);
        } else {
            const now = new Date();
            const dayOfWeek = now.getDay();
            const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
            targetWeekStart = new Date(now.setDate(diff));
        }
        targetWeekStart.setHours(0, 0, 0, 0);

        let mealPlan = await HomeMealPlan.findOne({
            where: { space_id: spaceId, week_start: targetWeekStart },
        });

        if (!mealPlan) {
            mealPlan = await HomeMealPlan.create({
                space_id: spaceId,
                week_start: targetWeekStart,
            });
        }

        const meals = await HomeMeal.findAll({
            where: { meal_plan_id: mealPlan.id },
            order: [
                ['day_of_week', 'ASC'],
                ['meal_type', 'ASC'],
            ],
        });

        return reply.send({
            success: true,
            data: { ...mealPlan.toJSON(), meals },
        });
    } catch (error) {
        console.error('Error getting meal plan:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update meal in plan
const updateMeal = async (request, reply) => {
    try {
        const { userId, spaceId, mealPlanId } = request.params;
        const { dayOfWeek, mealType, description, recipeId } = request.body;

        let meal = await HomeMeal.findOne({
            where: {
                meal_plan_id: mealPlanId,
                day_of_week: dayOfWeek,
                meal_type: mealType,
            },
        });

        if (meal) {
            await meal.update({ description, recipe_id: recipeId });
        } else {
            meal = await HomeMeal.create({
                meal_plan_id: mealPlanId,
                day_of_week: dayOfWeek,
                meal_type: mealType,
                description,
                recipe_id: recipeId,
            });
        }

        return reply.send({ success: true, data: meal });
    } catch (error) {
        console.error('Error updating meal:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Copy meal plan from previous week
const copyPreviousWeek = async (request, reply) => {
    try {
        const { userId, spaceId, mealPlanId } = request.params;

        const currentPlan = await HomeMealPlan.findByPk(mealPlanId);
        if (!currentPlan) {
            return reply.status(404).send({ success: false, error: 'Meal plan not found' });
        }

        const previousWeekStart = new Date(currentPlan.week_start);
        previousWeekStart.setDate(previousWeekStart.getDate() - 7);

        const previousPlan = await HomeMealPlan.findOne({
            where: { space_id: spaceId, week_start: previousWeekStart },
        });

        if (!previousPlan) {
            return reply.status(404).send({ success: false, error: 'No previous meal plan found' });
        }

        const previousMeals = await HomeMeal.findAll({
            where: { meal_plan_id: previousPlan.id },
        });

        // Delete current meals
        await HomeMeal.destroy({ where: { meal_plan_id: mealPlanId } });

        // Copy previous meals
        await Promise.all(
            previousMeals.map((meal) =>
                HomeMeal.create({
                    meal_plan_id: mealPlanId,
                    day_of_week: meal.day_of_week,
                    meal_type: meal.meal_type,
                    description: meal.description,
                    recipe_id: meal.recipe_id,
                })
            )
        );

        const newMeals = await HomeMeal.findAll({
            where: { meal_plan_id: mealPlanId },
        });

        return reply.send({
            success: true,
            data: { ...currentPlan.toJSON(), meals: newMeals },
        });
    } catch (error) {
        console.error('Error copying previous week:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get recipes
const getRecipes = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const { category, favorite } = request.query;

        const where = { space_id: spaceId };

        if (category) {
            where.category = category;
        }

        if (favorite === 'true') {
            where.is_favorite = true;
        }

        const recipes = await HomeRecipe.findAll({
            where,
            order: [['name', 'ASC']],
        });

        return reply.send({ success: true, data: recipes });
    } catch (error) {
        console.error('Error getting recipes:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Get a single recipe
const getRecipe = async (request, reply) => {
    try {
        const { userId, spaceId, recipeId } = request.params;

        const recipe = await HomeRecipe.findOne({
            where: { id: recipeId, space_id: spaceId },
        });

        if (!recipe) {
            return reply.status(404).send({ success: false, error: 'Recipe not found' });
        }

        return reply.send({ success: true, data: recipe });
    } catch (error) {
        console.error('Error getting recipe:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Create a recipe
const createRecipe = async (request, reply) => {
    try {
        const { userId, spaceId } = request.params;
        const data = request.body;

        const recipe = await HomeRecipe.create({
            ...data,
            space_id: spaceId,
        });

        return reply.status(201).send({ success: true, data: recipe });
    } catch (error) {
        console.error('Error creating recipe:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Update a recipe
const updateRecipe = async (request, reply) => {
    try {
        const { userId, spaceId, recipeId } = request.params;
        const data = request.body;

        const recipe = await HomeRecipe.findOne({
            where: { id: recipeId, space_id: spaceId },
        });

        if (!recipe) {
            return reply.status(404).send({ success: false, error: 'Recipe not found' });
        }

        await recipe.update(data);

        return reply.send({ success: true, data: recipe });
    } catch (error) {
        console.error('Error updating recipe:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Delete a recipe
const deleteRecipe = async (request, reply) => {
    try {
        const { userId, spaceId, recipeId } = request.params;

        const recipe = await HomeRecipe.findOne({
            where: { id: recipeId, space_id: spaceId },
        });

        if (!recipe) {
            return reply.status(404).send({ success: false, error: 'Recipe not found' });
        }

        await recipe.destroy();

        return reply.send({ success: true, message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Toggle recipe favorite
const toggleRecipeFavorite = async (request, reply) => {
    try {
        const { userId, spaceId, recipeId } = request.params;

        const recipe = await HomeRecipe.findOne({
            where: { id: recipeId, space_id: spaceId },
        });

        if (!recipe) {
            return reply.status(404).send({ success: false, error: 'Recipe not found' });
        }

        await recipe.update({ is_favorite: !recipe.is_favorite });

        return reply.send({ success: true, data: recipe });
    } catch (error) {
        console.error('Error toggling recipe favorite:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// Generate shopping list from meal plan
const generateShoppingList = async (request, reply) => {
    try {
        const { userId, spaceId, mealPlanId } = request.params;

        const meals = await HomeMeal.findAll({
            where: { meal_plan_id: mealPlanId },
        });

        // Collect all descriptions and recipe ingredients
        const items = [];

        for (const meal of meals) {
            if (meal.description) {
                // Simple parsing of description
                const words = meal.description.split(/[,;]/);
                items.push(...words.map((w) => w.trim()).filter((w) => w.length > 0));
            }

            if (meal.recipe_id) {
                const recipe = await HomeRecipe.findByPk(meal.recipe_id);
                if (recipe && recipe.ingredients) {
                    const ingredients = recipe.ingredients.split('\n');
                    items.push(...ingredients.map((i) => i.trim()).filter((i) => i.length > 0));
                }
            }
        }

        // Remove duplicates
        const uniqueItems = [...new Set(items.map((i) => i.toLowerCase()))];

        return reply.send({
            success: true,
            data: {
                mealPlanId,
                suggestedItems: uniqueItems,
            },
        });
    } catch (error) {
        console.error('Error generating shopping list:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    getMealPlan,
    updateMeal,
    copyPreviousWeek,
    getRecipes,
    getRecipe,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    toggleRecipeFavorite,
    generateShoppingList,
};

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const coreRoutes = require('./coreRoutes');
const habitRoutes = require('./habitRoutes');
const projectRoutes = require('./projectRoutes');
const financeRoutes = require('./financeRoutes');
const healthRoutes = require('./healthRoutes');
const studyRoutes = require('./studyRoutes');
const workRoutes = require('./workRoutes');
const meetingRoutes = require('./meetingRoutes');
const billingRoutes = require('./billingRoutes');
const okrRoutes = require('./okrRoutes');
const careerRoutes = require('./careerRoutes');
const homeRoutes = require('./homeRoutes');
const homeSpaceRoutes = require('./homeSpaceRoutes');
const homeMemberRoutes = require('./homeMemberRoutes');
const homeTaskRoutes = require('./homeTaskRoutes');
const homeMaintenanceRoutes = require('./homeMaintenanceRoutes');
const homeShoppingRoutes = require('./homeShoppingRoutes');
const homeStockRoutes = require('./homeStockRoutes');
const homeBillRoutes = require('./homeBillRoutes');
const homePlantRoutes = require('./homePlantRoutes');
const homePetRoutes = require('./homePetRoutes');
const homeMealRoutes = require('./homeMealRoutes');
const homeProjectRoutes = require('./homeProjectRoutes');
const homeDashboardRoutes = require('./homeDashboardRoutes');
const freezeModeRoutes = require('./freezeModeRoutes');
const workModeRoutes = require('./workModeRoutes');
const dailyStandupRoutes = require('./dailyStandupRoutes');
const endOfDayRoutes = require('./endOfDayRoutes');
const weeklyPlanRoutes = require('./weeklyPlanRoutes');
const workAnalyticsRoutes = require('./workAnalyticsRoutes');
const workReportsRoutes = require('./workReportsRoutes');
const socialSettingsRoutes = require('./socialSettingsRoutes');
const socialCircleRoutes = require('./socialCircleRoutes');
const socialContactRoutes = require('./socialContactRoutes');
const socialInteractionRoutes = require('./socialInteractionRoutes');
const socialEventRoutes = require('./socialEventRoutes');
const socialGiftRoutes = require('./socialGiftRoutes');
const socialDashboardRoutes = require('./socialDashboardRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const settingsRoutes = require('./settingsRoutes');
const profileRoutes = require('./profileRoutes');

async function routes(fastify, options) {
    // Health check endpoint
    fastify.get('/health', async (request, reply) => {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'vecto-backend'
        };
    });

    // Register API routes with /api prefix
    fastify.register(authRoutes, { prefix: '/api' });
    fastify.register(userRoutes, { prefix: '/api' });
    fastify.register(coreRoutes, { prefix: '/api' });
    fastify.register(habitRoutes, { prefix: '/api' });
    fastify.register(projectRoutes, { prefix: '/api' });
    fastify.register(financeRoutes, { prefix: '/api' });
    fastify.register(healthRoutes, { prefix: '/api' });
    fastify.register(studyRoutes, { prefix: '/api' });
    fastify.register(workRoutes, { prefix: '/api' });
    fastify.register(meetingRoutes, { prefix: '/api' });
    fastify.register(billingRoutes, { prefix: '/api' });
    fastify.register(okrRoutes, { prefix: '/api' });
    fastify.register(careerRoutes, { prefix: '/api' });
    fastify.register(homeRoutes, { prefix: '/api' });
    fastify.register(homeSpaceRoutes, { prefix: '/api' });
    fastify.register(homeMemberRoutes, { prefix: '/api' });
    fastify.register(homeTaskRoutes, { prefix: '/api' });
    fastify.register(homeMaintenanceRoutes, { prefix: '/api' });
    fastify.register(homeShoppingRoutes, { prefix: '/api' });
    fastify.register(homeStockRoutes, { prefix: '/api' });
    fastify.register(homeBillRoutes, { prefix: '/api' });
    fastify.register(homePlantRoutes, { prefix: '/api' });
    fastify.register(homePetRoutes, { prefix: '/api' });
    fastify.register(homeMealRoutes, { prefix: '/api' });
    fastify.register(homeProjectRoutes, { prefix: '/api' });
    fastify.register(homeDashboardRoutes, { prefix: '/api' });
    fastify.register(freezeModeRoutes, { prefix: '/api' });
    fastify.register(workModeRoutes, { prefix: '/api' });
    fastify.register(dailyStandupRoutes, { prefix: '/api' });
    fastify.register(endOfDayRoutes, { prefix: '/api' });
    fastify.register(weeklyPlanRoutes, { prefix: '/api' });
    fastify.register(workAnalyticsRoutes, { prefix: '/api' });
    fastify.register(workReportsRoutes, { prefix: '/api/work' });
    fastify.register(socialSettingsRoutes, { prefix: '/api' });
    fastify.register(socialCircleRoutes, { prefix: '/api' });
    fastify.register(socialContactRoutes, { prefix: '/api' });
    fastify.register(socialInteractionRoutes, { prefix: '/api' });
    fastify.register(socialEventRoutes, { prefix: '/api' });
    fastify.register(socialGiftRoutes, { prefix: '/api' });
    fastify.register(socialDashboardRoutes, { prefix: '/api' });
    fastify.register(dashboardRoutes, { prefix: '/api' });
    fastify.register(settingsRoutes, { prefix: '/api' });
    fastify.register(profileRoutes, { prefix: '/api' });
}

module.exports = routes;

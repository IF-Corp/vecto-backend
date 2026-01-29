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
const freezeModeRoutes = require('./freezeModeRoutes');
const workModeRoutes = require('./workModeRoutes');
const dailyStandupRoutes = require('./dailyStandupRoutes');
const endOfDayRoutes = require('./endOfDayRoutes');
const weeklyPlanRoutes = require('./weeklyPlanRoutes');
const workAnalyticsRoutes = require('./workAnalyticsRoutes');
const workReportsRoutes = require('./workReportsRoutes');

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
    fastify.register(freezeModeRoutes, { prefix: '/api' });
    fastify.register(workModeRoutes, { prefix: '/api' });
    fastify.register(dailyStandupRoutes, { prefix: '/api' });
    fastify.register(endOfDayRoutes, { prefix: '/api' });
    fastify.register(weeklyPlanRoutes, { prefix: '/api' });
    fastify.register(workAnalyticsRoutes, { prefix: '/api' });
    fastify.register(workReportsRoutes, { prefix: '/api/work' });
}

module.exports = routes;

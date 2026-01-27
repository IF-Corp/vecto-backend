const {
  getWeeklyReport,
  getMonthlyReport,
  getBillingReport,
} = require('../controllers/workReportsController')

const {
  getDashboardData,
  getDashboardQuickStats,
  getDashboardActivity,
  getDashboardDeadlines,
  getDashboardProjectDistribution,
  getDashboardProductivity,
} = require('../controllers/workDashboardController')

// Schema definitions
const weeklyReportQuerySchema = {
  type: 'object',
  properties: {
    week_start: { type: 'string', format: 'date' },
  },
}

const monthlyReportQuerySchema = {
  type: 'object',
  properties: {
    month: { type: 'integer', minimum: 1, maximum: 12 },
    year: { type: 'integer', minimum: 2020 },
  },
}

const billingReportQuerySchema = {
  type: 'object',
  properties: {
    month: { type: 'integer', minimum: 1, maximum: 12 },
    year: { type: 'integer', minimum: 2020 },
  },
}

const activityQuerySchema = {
  type: 'object',
  properties: {
    limit: { type: 'integer', minimum: 1, maximum: 50 },
  },
}

const deadlinesQuerySchema = {
  type: 'object',
  properties: {
    days: { type: 'integer', minimum: 1, maximum: 90 },
  },
}

const distributionQuerySchema = {
  type: 'object',
  properties: {
    period: { type: 'string', enum: ['week', 'month'] },
  },
}

async function workReportsRoutes(fastify, options) {
  // Add authentication hook
  fastify.addHook('preHandler', fastify.authenticate)

  // =====================
  // Reports Routes
  // =====================

  // GET /work/reports/weekly - Get weekly report
  fastify.get('/reports/weekly', {
    schema: {
      querystring: weeklyReportQuerySchema,
      tags: ['work-reports'],
      summary: 'Get weekly work report',
    },
    handler: getWeeklyReport,
  })

  // GET /work/reports/monthly - Get monthly report
  fastify.get('/reports/monthly', {
    schema: {
      querystring: monthlyReportQuerySchema,
      tags: ['work-reports'],
      summary: 'Get monthly work report',
    },
    handler: getMonthlyReport,
  })

  // GET /work/reports/billing - Get billing report
  fastify.get('/reports/billing', {
    schema: {
      querystring: billingReportQuerySchema,
      tags: ['work-reports'],
      summary: 'Get billing report (PJ/Freelancer)',
    },
    handler: getBillingReport,
  })

  // =====================
  // Dashboard Routes
  // =====================

  // GET /work/dashboard - Get full dashboard data
  fastify.get('/dashboard', {
    schema: {
      tags: ['work-dashboard'],
      summary: 'Get complete work dashboard data',
    },
    handler: getDashboardData,
  })

  // GET /work/dashboard/stats - Get quick stats only
  fastify.get('/dashboard/stats', {
    schema: {
      tags: ['work-dashboard'],
      summary: 'Get dashboard quick stats',
    },
    handler: getDashboardQuickStats,
  })

  // GET /work/dashboard/activity - Get recent activity
  fastify.get('/dashboard/activity', {
    schema: {
      querystring: activityQuerySchema,
      tags: ['work-dashboard'],
      summary: 'Get recent work activity',
    },
    handler: getDashboardActivity,
  })

  // GET /work/dashboard/deadlines - Get upcoming deadlines
  fastify.get('/dashboard/deadlines', {
    schema: {
      querystring: deadlinesQuerySchema,
      tags: ['work-dashboard'],
      summary: 'Get upcoming task deadlines',
    },
    handler: getDashboardDeadlines,
  })

  // GET /work/dashboard/distribution - Get project distribution
  fastify.get('/dashboard/distribution', {
    schema: {
      querystring: distributionQuerySchema,
      tags: ['work-dashboard'],
      summary: 'Get project hours distribution',
    },
    handler: getDashboardProjectDistribution,
  })

  // GET /work/dashboard/productivity - Get productivity score
  fastify.get('/dashboard/productivity', {
    schema: {
      tags: ['work-dashboard'],
      summary: 'Get productivity score',
    },
    handler: getDashboardProductivity,
  })
}

module.exports = workReportsRoutes

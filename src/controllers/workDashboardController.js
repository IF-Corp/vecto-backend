const { Op } = require('sequelize')
const {
  WorkSession,
  Timesheet,
  Task,
  Project,
  Client,
  WorkEnergyLog,
  sequelize,
} = require('../models')
const { startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, format, parseISO } = require('date-fns')

// =====================
// Dashboard Data Functions
// =====================

/**
 * Get today's summary for dashboard
 */
const getTodaySummary = async (userId) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Get today's timesheets
  const todayTimesheets = await Timesheet.findAll({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    },
    include: [
      { model: Project, as: 'project', attributes: ['name'] },
      { model: Task, as: 'task', attributes: ['title'] },
    ],
  })

  const hoursWorked = todayTimesheets.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)
  const projectsWorked = [...new Set(todayTimesheets.map(t => t.project_id).filter(Boolean))].length

  // Get active work session
  const activeSession = await WorkSession.findOne({
    where: {
      user_id: userId,
      status: 'active',
    },
  })

  // Get today's tasks completed
  const tasksCompleted = await Task.count({
    where: {
      assigned_to: userId,
      status: 'completed',
      updated_at: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    },
  })

  // Get latest energy log
  const latestEnergy = await WorkEnergyLog.findOne({
    where: {
      user_id: userId,
      timestamp: {
        [Op.gte]: today,
        [Op.lt]: tomorrow,
      },
    },
    order: [['timestamp', 'DESC']],
  })

  return {
    hoursWorked: Math.round(hoursWorked * 10) / 10,
    projectsWorked,
    tasksCompleted,
    activeSession: activeSession ? {
      id: activeSession.id,
      mode: activeSession.mode,
      startedAt: activeSession.start_time,
      duration: activeSession.start_time ?
        Math.floor((Date.now() - new Date(activeSession.start_time).getTime()) / 1000) : 0,
    } : null,
    currentEnergy: latestEnergy ? latestEnergy.energy_level : null,
  }
}

/**
 * Get week summary for dashboard
 */
const getWeekSummary = async (userId) => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  // Get week's timesheets
  const weekTimesheets = await Timesheet.findAll({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: weekStart,
        [Op.lte]: weekEnd,
      },
    },
  })

  const hoursWorked = weekTimesheets.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)
  const targetHours = 40 // Default target

  // Group hours by day
  const dailyHours = {}
  weekTimesheets.forEach(t => {
    const day = format(new Date(t.date), 'yyyy-MM-dd')
    dailyHours[day] = (dailyHours[day] || 0) + (parseFloat(t.hours) || 0)
  })

  // Get week's tasks
  const tasksCompleted = await Task.count({
    where: {
      assigned_to: userId,
      status: 'completed',
      updated_at: {
        [Op.gte]: weekStart,
        [Op.lte]: weekEnd,
      },
    },
  })

  const tasksInProgress = await Task.count({
    where: {
      assigned_to: userId,
      status: 'in_progress',
    },
  })

  // Get billable hours
  const billableTimesheets = weekTimesheets.filter(t => t.billable)
  const billableHours = billableTimesheets.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)

  return {
    hoursWorked: Math.round(hoursWorked * 10) / 10,
    targetHours,
    progress: Math.round((hoursWorked / targetHours) * 100),
    dailyHours,
    tasksCompleted,
    tasksInProgress,
    billableHours: Math.round(billableHours * 10) / 10,
    billablePercentage: hoursWorked > 0 ? Math.round((billableHours / hoursWorked) * 100) : 0,
  }
}

/**
 * Get quick stats for dashboard cards
 */
const getQuickStats = async (userId) => {
  const now = new Date()
  const monthStart = startOfMonth(now)
  const monthEnd = endOfMonth(now)
  const lastMonthStart = startOfMonth(subDays(monthStart, 1))
  const lastMonthEnd = endOfMonth(lastMonthStart)

  // This month's hours
  const thisMonthTimesheets = await Timesheet.findAll({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: monthStart,
        [Op.lte]: monthEnd,
      },
    },
  })

  const thisMonthHours = thisMonthTimesheets.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)

  // Last month's hours
  const lastMonthTimesheets = await Timesheet.findAll({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: lastMonthStart,
        [Op.lte]: lastMonthEnd,
      },
    },
  })

  const lastMonthHours = lastMonthTimesheets.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)

  // Active projects count
  const activeProjects = await Project.count({
    where: {
      status: 'active',
    },
    include: [{
      model: Timesheet,
      as: 'timesheets',
      where: { user_id: userId },
      required: true,
    }],
  })

  // Pending tasks count
  const pendingTasks = await Task.count({
    where: {
      assigned_to: userId,
      status: {
        [Op.in]: ['pending', 'in_progress'],
      },
    },
  })

  // Calculate month over month change
  const hoursDiff = thisMonthHours - lastMonthHours
  const hoursChangePercent = lastMonthHours > 0 ?
    Math.round((hoursDiff / lastMonthHours) * 100) : 0

  return {
    monthlyHours: Math.round(thisMonthHours * 10) / 10,
    hoursChange: {
      value: Math.round(hoursDiff * 10) / 10,
      percent: hoursChangePercent,
      trend: hoursDiff >= 0 ? 'up' : 'down',
    },
    activeProjects,
    pendingTasks,
  }
}

/**
 * Get recent activity for dashboard feed
 */
const getRecentActivity = async (userId, limit = 10) => {
  const activities = []

  // Recent timesheets
  const recentTimesheets = await Timesheet.findAll({
    where: { user_id: userId },
    include: [
      { model: Project, as: 'project', attributes: ['name'] },
      { model: Task, as: 'task', attributes: ['title'] },
    ],
    order: [['created_at', 'DESC']],
    limit: 5,
  })

  recentTimesheets.forEach(t => {
    activities.push({
      type: 'timesheet',
      title: `${t.hours}h em ${t.project?.name || 'Projeto'}`,
      subtitle: t.task?.title || t.description,
      timestamp: t.created_at,
      icon: 'clock',
    })
  })

  // Recent completed tasks
  const recentTasks = await Task.findAll({
    where: {
      assigned_to: userId,
      status: 'completed',
    },
    include: [
      { model: Project, as: 'project', attributes: ['name'] },
    ],
    order: [['updated_at', 'DESC']],
    limit: 5,
  })

  recentTasks.forEach(t => {
    activities.push({
      type: 'task_completed',
      title: `Concluiu: ${t.title}`,
      subtitle: t.project?.name,
      timestamp: t.updated_at,
      icon: 'check',
    })
  })

  // Recent work sessions
  const recentSessions = await WorkSession.findAll({
    where: {
      user_id: userId,
      status: 'completed',
    },
    order: [['end_time', 'DESC']],
    limit: 3,
  })

  recentSessions.forEach(s => {
    const duration = s.duration_seconds ? Math.round(s.duration_seconds / 60) : 0
    activities.push({
      type: 'work_session',
      title: `Sessão ${s.mode}: ${duration}min`,
      subtitle: s.notes,
      timestamp: s.end_time,
      icon: 'timer',
    })
  })

  // Sort by timestamp and limit
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit)
}

/**
 * Get upcoming deadlines
 */
const getUpcomingDeadlines = async (userId, days = 7) => {
  const now = new Date()
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + days)

  const tasks = await Task.findAll({
    where: {
      assigned_to: userId,
      due_date: {
        [Op.gte]: now,
        [Op.lte]: futureDate,
      },
      status: {
        [Op.notIn]: ['completed', 'cancelled'],
      },
    },
    include: [
      { model: Project, as: 'project', attributes: ['name', 'color'] },
    ],
    order: [['due_date', 'ASC']],
    limit: 10,
  })

  return tasks.map(t => ({
    id: t.id,
    title: t.title,
    dueDate: t.due_date,
    priority: t.priority,
    project: t.project ? {
      name: t.project.name,
      color: t.project.color,
    } : null,
    daysRemaining: Math.ceil((new Date(t.due_date) - now) / (1000 * 60 * 60 * 24)),
  }))
}

/**
 * Get project distribution for charts
 */
const getProjectDistribution = async (userId, period = 'week') => {
  const now = new Date()
  let startDate, endDate

  if (period === 'week') {
    startDate = startOfWeek(now, { weekStartsOn: 1 })
    endDate = endOfWeek(now, { weekStartsOn: 1 })
  } else {
    startDate = startOfMonth(now)
    endDate = endOfMonth(now)
  }

  const timesheets = await Timesheet.findAll({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    include: [
      { model: Project, as: 'project', attributes: ['id', 'name', 'color'] },
    ],
  })

  // Group by project
  const projectHours = {}
  let totalHours = 0

  timesheets.forEach(t => {
    const hours = parseFloat(t.hours) || 0
    totalHours += hours

    if (t.project) {
      const key = t.project.id
      if (!projectHours[key]) {
        projectHours[key] = {
          id: t.project.id,
          name: t.project.name,
          color: t.project.color || '#6366f1',
          hours: 0,
        }
      }
      projectHours[key].hours += hours
    }
  })

  // Convert to array and calculate percentages
  const distribution = Object.values(projectHours)
    .map(p => ({
      ...p,
      hours: Math.round(p.hours * 10) / 10,
      percentage: totalHours > 0 ? Math.round((p.hours / totalHours) * 100) : 0,
    }))
    .sort((a, b) => b.hours - a.hours)

  return {
    period,
    totalHours: Math.round(totalHours * 10) / 10,
    projects: distribution,
  }
}

/**
 * Get productivity score for dashboard
 */
const getProductivityScore = async (userId) => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  // Factors for productivity score
  let score = 5 // Base score

  // Factor 1: Hours worked vs target (max +2)
  const timesheets = await Timesheet.findAll({
    where: {
      user_id: userId,
      date: {
        [Op.gte]: weekStart,
        [Op.lte]: weekEnd,
      },
    },
  })

  const hoursWorked = timesheets.reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)
  const targetHours = 40
  const hoursRatio = hoursWorked / targetHours

  if (hoursRatio >= 0.9 && hoursRatio <= 1.1) {
    score += 2 // Perfect balance
  } else if (hoursRatio >= 0.7 && hoursRatio < 0.9) {
    score += 1 // Slightly under
  } else if (hoursRatio > 1.1 && hoursRatio <= 1.3) {
    score += 0.5 // Slightly over
  } else if (hoursRatio > 1.3) {
    score -= 1 // Overworking penalty
  }

  // Factor 2: Tasks completed (max +1.5)
  const tasksCompleted = await Task.count({
    where: {
      assigned_to: userId,
      status: 'completed',
      updated_at: {
        [Op.gte]: weekStart,
        [Op.lte]: weekEnd,
      },
    },
  })

  if (tasksCompleted >= 10) score += 1.5
  else if (tasksCompleted >= 5) score += 1
  else if (tasksCompleted >= 3) score += 0.5

  // Factor 3: Billable ratio (max +1)
  const billableHours = timesheets
    .filter(t => t.billable)
    .reduce((sum, t) => sum + (parseFloat(t.hours) || 0), 0)

  const billableRatio = hoursWorked > 0 ? billableHours / hoursWorked : 0
  if (billableRatio >= 0.7) score += 1
  else if (billableRatio >= 0.5) score += 0.5

  // Factor 4: Consistent daily work (max +0.5)
  const daysWorked = [...new Set(timesheets.map(t => format(new Date(t.date), 'yyyy-MM-dd')))].length
  if (daysWorked >= 5) score += 0.5

  // Clamp score between 0 and 10
  score = Math.max(0, Math.min(10, score))

  // Determine color and label
  let color = 'red'
  let label = 'Precisa melhorar'

  if (score >= 8) {
    color = 'green'
    label = 'Excelente'
  } else if (score >= 6) {
    color = 'blue'
    label = 'Bom'
  } else if (score >= 4) {
    color = 'yellow'
    label = 'Regular'
  }

  return {
    score: Math.round(score * 10) / 10,
    color,
    label,
    factors: {
      hoursBalance: Math.round(hoursRatio * 100),
      tasksCompleted,
      billableRatio: Math.round(billableRatio * 100),
      daysWorked,
    },
  }
}

// =====================
// Endpoint Handlers
// =====================

const getDashboardData = async (request, reply) => {
  try {
    const userId = request.user.id

    // Fetch all dashboard data in parallel
    const [
      todaySummary,
      weekSummary,
      quickStats,
      recentActivity,
      upcomingDeadlines,
      projectDistribution,
      productivityScore,
    ] = await Promise.all([
      getTodaySummary(userId),
      getWeekSummary(userId),
      getQuickStats(userId),
      getRecentActivity(userId),
      getUpcomingDeadlines(userId),
      getProjectDistribution(userId, 'week'),
      getProductivityScore(userId),
    ])

    return reply.send({
      today: todaySummary,
      week: weekSummary,
      stats: quickStats,
      recentActivity,
      upcomingDeadlines,
      projectDistribution,
      productivityScore,
    })
  } catch (error) {
    console.error('Error getting dashboard data:', error)
    return reply.status(500).send({ error: 'Failed to get dashboard data' })
  }
}

const getDashboardQuickStats = async (request, reply) => {
  try {
    const userId = request.user.id
    const stats = await getQuickStats(userId)
    return reply.send(stats)
  } catch (error) {
    console.error('Error getting quick stats:', error)
    return reply.status(500).send({ error: 'Failed to get quick stats' })
  }
}

const getDashboardActivity = async (request, reply) => {
  try {
    const userId = request.user.id
    const { limit = 10 } = request.query
    const activity = await getRecentActivity(userId, parseInt(limit))
    return reply.send({ activities: activity })
  } catch (error) {
    console.error('Error getting recent activity:', error)
    return reply.status(500).send({ error: 'Failed to get recent activity' })
  }
}

const getDashboardDeadlines = async (request, reply) => {
  try {
    const userId = request.user.id
    const { days = 7 } = request.query
    const deadlines = await getUpcomingDeadlines(userId, parseInt(days))
    return reply.send({ deadlines })
  } catch (error) {
    console.error('Error getting upcoming deadlines:', error)
    return reply.status(500).send({ error: 'Failed to get upcoming deadlines' })
  }
}

const getDashboardProjectDistribution = async (request, reply) => {
  try {
    const userId = request.user.id
    const { period = 'week' } = request.query
    const distribution = await getProjectDistribution(userId, period)
    return reply.send(distribution)
  } catch (error) {
    console.error('Error getting project distribution:', error)
    return reply.status(500).send({ error: 'Failed to get project distribution' })
  }
}

const getDashboardProductivity = async (request, reply) => {
  try {
    const userId = request.user.id
    const productivity = await getProductivityScore(userId)
    return reply.send(productivity)
  } catch (error) {
    console.error('Error getting productivity score:', error)
    return reply.status(500).send({ error: 'Failed to get productivity score' })
  }
}

module.exports = {
  getDashboardData,
  getDashboardQuickStats,
  getDashboardActivity,
  getDashboardDeadlines,
  getDashboardProjectDistribution,
  getDashboardProductivity,
}

const {
    WorkMeeting,
    WorkMeetingParticipant,
    WorkMeetingNote,
    WorkMeetingAction,
    WorkProject,
    WorkTask,
    WorkTimeEntry,
} = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// ==================== MEETINGS ====================

const getMeetings = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate, category, projectId } = request.query;

        const where = { user_id: userId };

        if (startDate || endDate) {
            where.start_time = {};
            if (startDate) where.start_time[Op.gte] = new Date(startDate);
            if (endDate) where.start_time[Op.lte] = new Date(endDate);
        }

        if (category) where.category = category;
        if (projectId) where.project_id = projectId;

        const meetings = await WorkMeeting.findAll({
            where,
            include: [
                { association: 'project', attributes: ['id', 'name', 'color'] },
                { association: 'participants', attributes: ['id', 'name', 'email', 'is_organizer'] },
            ],
            order: [['start_time', 'DESC']],
        });

        return { success: true, data: meetings };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getMeeting = async (request, reply) => {
    try {
        const { id } = request.params;
        const meeting = await WorkMeeting.findByPk(id, {
            include: [
                { association: 'project', attributes: ['id', 'name', 'color'] },
                { association: 'participants' },
                { association: 'notes', order: [['created_at', 'DESC']] },
                {
                    association: 'actions',
                    include: [{ association: 'convertedTask', attributes: ['id', 'title'] }],
                    order: [['created_at', 'ASC']],
                },
            ],
        });

        if (!meeting) {
            reply.status(404);
            return { success: false, error: 'Meeting not found' };
        }

        return { success: true, data: meeting };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createMeeting = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { participants, ...meetingData } = request.body;

        const meeting = await WorkMeeting.create({
            ...meetingData,
            user_id: userId,
        });

        // Add participants if provided
        if (participants && participants.length > 0) {
            await Promise.all(
                participants.map((p) =>
                    WorkMeetingParticipant.create({
                        meeting_id: meeting.id,
                        name: p.name,
                        email: p.email,
                        is_organizer: p.isOrganizer || false,
                    })
                )
            );
        }

        const meetingWithRelations = await WorkMeeting.findByPk(meeting.id, {
            include: [
                { association: 'project', attributes: ['id', 'name', 'color'] },
                { association: 'participants' },
            ],
        });

        reply.status(201);
        return { success: true, data: meetingWithRelations, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMeeting = async (request, reply) => {
    try {
        const { id } = request.params;
        const { participants, ...meetingData } = request.body;

        const meeting = await WorkMeeting.findByPk(id);

        if (!meeting) {
            reply.status(404);
            return { success: false, error: 'Meeting not found' };
        }

        await meeting.update(meetingData);

        // Update participants if provided
        if (participants !== undefined) {
            await WorkMeetingParticipant.destroy({ where: { meeting_id: id } });
            if (participants.length > 0) {
                await Promise.all(
                    participants.map((p) =>
                        WorkMeetingParticipant.create({
                            meeting_id: id,
                            name: p.name,
                            email: p.email,
                            is_organizer: p.isOrganizer || false,
                        })
                    )
                );
            }
        }

        const meetingWithRelations = await WorkMeeting.findByPk(id, {
            include: [
                { association: 'project', attributes: ['id', 'name', 'color'] },
                { association: 'participants' },
            ],
        });

        return { success: true, data: meetingWithRelations };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMeeting = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkMeeting.destroy({ where: { id } });

        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Meeting not found' };
        }

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== MEETING NOTES ====================

const addMeetingNote = async (request, reply) => {
    try {
        const { meetingId } = request.params;
        const { content } = request.body;

        const note = await WorkMeetingNote.create({
            meeting_id: meetingId,
            content,
        });

        reply.status(201);
        return { success: true, data: note, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMeetingNote = async (request, reply) => {
    try {
        const { id } = request.params;
        const { content } = request.body;

        const note = await WorkMeetingNote.findByPk(id);

        if (!note) {
            reply.status(404);
            return { success: false, error: 'Note not found' };
        }

        await note.update({ content });
        return { success: true, data: note };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMeetingNote = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkMeetingNote.destroy({ where: { id } });

        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Note not found' };
        }

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== MEETING ACTIONS ====================

const getMeetingActions = async (request, reply) => {
    try {
        const { meetingId } = request.params;
        const actions = await WorkMeetingAction.findAll({
            where: { meeting_id: meetingId },
            include: [{ association: 'convertedTask', attributes: ['id', 'title'] }],
            order: [['created_at', 'ASC']],
        });
        return { success: true, data: actions };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const addMeetingAction = async (request, reply) => {
    try {
        const { meetingId } = request.params;
        const { description, assignee, dueDate } = request.body;

        const action = await WorkMeetingAction.create({
            meeting_id: meetingId,
            description,
            assignee,
            due_date: dueDate,
        });

        reply.status(201);
        return { success: true, data: action, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateMeetingAction = async (request, reply) => {
    try {
        const { id } = request.params;
        const action = await WorkMeetingAction.findByPk(id);

        if (!action) {
            reply.status(404);
            return { success: false, error: 'Action not found' };
        }

        // Handle completion toggle
        if (request.body.isCompleted !== undefined) {
            if (request.body.isCompleted && !action.is_completed) {
                request.body.completed_at = new Date();
            } else if (!request.body.isCompleted) {
                request.body.completed_at = null;
            }
        }

        await action.update(request.body);
        return { success: true, data: action };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteMeetingAction = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await WorkMeetingAction.destroy({ where: { id } });

        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Action not found' };
        }

        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const convertActionToTask = async (request, reply) => {
    try {
        const { id } = request.params;
        const { projectId, statusId, typeId } = request.body;

        const action = await WorkMeetingAction.findByPk(id, {
            include: [{ association: 'meeting' }],
        });

        if (!action) {
            reply.status(404);
            return { success: false, error: 'Action not found' };
        }

        if (action.converted_task_id) {
            reply.status(400);
            return { success: false, error: 'Action already converted to task' };
        }

        // Create task from action
        const task = await WorkTask.create({
            user_id: action.meeting.user_id,
            project_id: projectId || action.meeting.project_id,
            status_id: statusId,
            type_id: typeId,
            title: action.description.substring(0, 200),
            description: `Acao de reuniao: ${action.meeting.title}\n\n${action.description}`,
            deadline: action.due_date,
            is_urgent: action.due_date && new Date(action.due_date) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            is_important: true,
        });

        // Update action with task reference
        await action.update({ converted_task_id: task.id });

        return { success: true, data: { action, task } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== MEETING ANALYSIS ====================

const getMeetingAnalysis = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { startDate, endDate } = request.query;

        // Default to current week if no dates provided
        const end = endDate ? new Date(endDate) : new Date();
        const start = startDate
            ? new Date(startDate)
            : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Get meetings in period
        const meetings = await WorkMeeting.findAll({
            where: {
                user_id: userId,
                start_time: { [Op.between]: [start, end] },
            },
            attributes: ['id', 'title', 'duration_minutes', 'category', 'start_time'],
        });

        // Calculate total meeting hours
        const totalMeetingMinutes = meetings.reduce((sum, m) => sum + m.duration_minutes, 0);
        const totalMeetingHours = Math.round((totalMeetingMinutes / 60) * 10) / 10;

        // Get total work hours in period
        const timeEntries = await WorkTimeEntry.findAll({
            where: {
                user_id: userId,
                started_at: { [Op.between]: [start, end] },
            },
            attributes: ['duration_minutes'],
        });

        const totalWorkMinutes = timeEntries.reduce((sum, e) => sum + (e.duration_minutes || 0), 0);
        const totalWorkHours = Math.round((totalWorkMinutes / 60) * 10) / 10;

        // Calculate meeting load percentage
        const totalHours = totalMeetingHours + totalWorkHours;
        const meetingLoadPercentage = totalHours > 0 ? Math.round((totalMeetingHours / totalHours) * 100) : 0;

        // Meetings by category
        const byCategory = {};
        meetings.forEach((m) => {
            if (!byCategory[m.category]) {
                byCategory[m.category] = { count: 0, minutes: 0 };
            }
            byCategory[m.category].count++;
            byCategory[m.category].minutes += m.duration_minutes;
        });

        const categoryBreakdown = Object.entries(byCategory).map(([category, data]) => ({
            category,
            count: data.count,
            hours: Math.round((data.minutes / 60) * 10) / 10,
        }));

        // Time distribution
        const deepWorkHours = Math.max(0, totalWorkHours - totalMeetingHours * 0.5);
        const adminHours = totalWorkHours * 0.1;

        const timeDistribution = [
            { type: 'meetings', label: 'Reunioes', hours: totalMeetingHours, percentage: meetingLoadPercentage },
            {
                type: 'deepWork',
                label: 'Deep Work',
                hours: Math.round(deepWorkHours * 10) / 10,
                percentage: totalHours > 0 ? Math.round((deepWorkHours / totalHours) * 100) : 0,
            },
            {
                type: 'tasks',
                label: 'Tarefas',
                hours: Math.round((totalWorkHours - deepWorkHours - adminHours) * 10) / 10,
                percentage: totalHours > 0 ? Math.round(((totalWorkHours - deepWorkHours - adminHours) / totalHours) * 100) : 0,
            },
            {
                type: 'admin',
                label: 'Admin',
                hours: Math.round(adminHours * 10) / 10,
                percentage: totalHours > 0 ? Math.round((adminHours / totalHours) * 100) : 0,
            },
        ];

        // Generate alerts and suggestions
        const alerts = [];
        if (meetingLoadPercentage > 30) {
            alerts.push({
                type: 'warning',
                message: `Carga de reunioes acima do ideal (${meetingLoadPercentage}% > 30%)`,
                suggestion: 'Considere recusar ou encurtar algumas reunioes',
            });
        }

        const dailyCounts = {};
        meetings.forEach((m) => {
            const day = new Date(m.start_time).toISOString().split('T')[0];
            dailyCounts[day] = (dailyCounts[day] || 0) + 1;
        });

        const maxDailyMeetings = Math.max(...Object.values(dailyCounts), 0);
        if (maxDailyMeetings > 5) {
            alerts.push({
                type: 'warning',
                message: `Dia com ${maxDailyMeetings} reunioes detectado`,
                suggestion: 'Tente distribuir melhor suas reunioes ao longo da semana',
            });
        }

        return {
            success: true,
            data: {
                period: { start: start.toISOString(), end: end.toISOString() },
                summary: {
                    totalMeetings: meetings.length,
                    totalMeetingHours,
                    totalWorkHours,
                    meetingLoadPercentage,
                    isAboveIdeal: meetingLoadPercentage > 30,
                },
                byCategory: categoryBreakdown,
                timeDistribution,
                alerts,
            },
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Meetings
    getMeetings,
    getMeeting,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    // Notes
    addMeetingNote,
    updateMeetingNote,
    deleteMeetingNote,
    // Actions
    getMeetingActions,
    addMeetingAction,
    updateMeetingAction,
    deleteMeetingAction,
    convertActionToTask,
    // Analysis
    getMeetingAnalysis,
};

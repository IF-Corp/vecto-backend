const { Project, Task, MeetingHistory } = require('../models');

class ProjectController {
    // ==================== PROJECTS ====================

    async getProjects(request, reply) {
        try {
            const { userId } = request.params;

            const projects = await Project.findAll({
                where: { user_id: userId },
                include: [{ model: Task, as: 'tasks' }]
            });

            return reply.send({ success: true, data: projects });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createProject(request, reply) {
        try {
            const { userId } = request.params;
            const { name, deadline, status, life_area } = request.body;

            if (!name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const project = await Project.create({
                user_id: userId,
                name,
                deadline,
                status: status || 'IN_PROGRESS',
                life_area
            });

            return reply.status(201).send({ success: true, data: project });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async updateProject(request, reply) {
        try {
            const { id } = request.params;
            const updates = request.body;

            const project = await Project.findByPk(id);
            if (!project) {
                return reply.status(404).send({ success: false, error: 'Project not found' });
            }

            await project.update(updates);
            return reply.send({ success: true, data: project });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async deleteProject(request, reply) {
        try {
            const { id } = request.params;

            const project = await Project.findByPk(id);
            if (!project) {
                return reply.status(404).send({ success: false, error: 'Project not found' });
            }

            await project.destroy();
            return reply.send({ success: true, message: 'Project deleted' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== TASKS ====================

    async getTasks(request, reply) {
        try {
            const { userId } = request.params;
            const { status, project_id } = request.query;

            const where = { user_id: userId };
            if (status) where.status = status;
            if (project_id) where.project_id = project_id;

            const tasks = await Task.findAll({
                where,
                include: [{ model: Project, as: 'project', attributes: ['id', 'name'] }]
            });

            return reply.send({ success: true, data: tasks });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createTask(request, reply) {
        try {
            const { userId } = request.params;
            const data = request.body;

            if (!data.name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const task = await Task.create({
                user_id: userId,
                ...data,
                tags: data.tags || [],
                assignees: data.assignees || []
            });

            return reply.status(201).send({ success: true, data: task });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async updateTask(request, reply) {
        try {
            const { id } = request.params;
            const updates = request.body;

            const task = await Task.findByPk(id);
            if (!task) {
                return reply.status(404).send({ success: false, error: 'Task not found' });
            }

            await task.update(updates);
            return reply.send({ success: true, data: task });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async deleteTask(request, reply) {
        try {
            const { id } = request.params;

            const task = await Task.findByPk(id);
            if (!task) {
                return reply.status(404).send({ success: false, error: 'Task not found' });
            }

            await task.destroy();
            return reply.send({ success: true, message: 'Task deleted' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== MEETINGS ====================

    async getMeetings(request, reply) {
        try {
            const { projectId } = request.params;

            const meetings = await MeetingHistory.findAll({
                where: { project_id: projectId },
                order: [['start_date', 'DESC']]
            });

            return reply.send({ success: true, data: meetings });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createMeeting(request, reply) {
        try {
            const { projectId } = request.params;
            const { title, start_date, actual_duration, agenda_description, documentation_link } = request.body;

            if (!title || !start_date) {
                return reply.status(400).send({ success: false, error: 'Title and start_date are required' });
            }

            const meeting = await MeetingHistory.create({
                project_id: projectId,
                title,
                start_date,
                actual_duration,
                agenda_description,
                documentation_link
            });

            return reply.status(201).send({ success: true, data: meeting });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async deleteMeeting(request, reply) {
        try {
            const { id } = request.params;

            const meeting = await MeetingHistory.findByPk(id);
            if (!meeting) {
                return reply.status(404).send({ success: false, error: 'Meeting not found' });
            }

            await meeting.destroy();
            return reply.send({ success: true, message: 'Meeting deleted' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }
}

module.exports = new ProjectController();

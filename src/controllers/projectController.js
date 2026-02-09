const { Project, Task, MeetingHistory, Subtask } = require('../models');

function getLocalDateString() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

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
                include: [
                    { model: Project, as: 'project', attributes: ['id', 'name'] },
                    { model: Subtask, as: 'subtasks', order: [['order', 'ASC']] }
                ]
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
            const { subtasks, ...data } = request.body;

            if (!data.name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const taskData = {
                user_id: userId,
                ...data,
                tags: data.tags || [],
                assignees: data.assignees || []
            };

            if (taskData.status === 'DONE') {
                taskData.completed_at = getLocalDateString();
            }

            const task = await Task.create(taskData);

            // Create subtasks if provided
            if (subtasks && Array.isArray(subtasks) && subtasks.length > 0) {
                const subtaskRecords = subtasks.map((st, index) => ({
                    task_id: task.id,
                    title: st.title,
                    completed: st.completed || false,
                    order: st.order ?? index
                }));
                await Subtask.bulkCreate(subtaskRecords);
            }

            // Reload with subtasks
            const taskWithSubtasks = await Task.findByPk(task.id, {
                include: [{ model: Subtask, as: 'subtasks', order: [['order', 'ASC']] }]
            });

            return reply.status(201).send({ success: true, data: taskWithSubtasks });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async updateTask(request, reply) {
        try {
            const { id } = request.params;
            const { subtasks, ...updates } = request.body;

            const task = await Task.findByPk(id);
            if (!task) {
                return reply.status(404).send({ success: false, error: 'Task not found' });
            }

            // Handle completed_at based on status changes
            if (updates.status) {
                if (updates.status === 'DONE' && task.status !== 'DONE') {
                    updates.completed_at = getLocalDateString();
                } else if (updates.status !== 'DONE' && task.status === 'DONE') {
                    updates.completed_at = null;
                }
            }

            await task.update(updates);

            // Handle subtasks update if provided
            if (subtasks !== undefined && Array.isArray(subtasks)) {
                // Get existing subtasks
                const existingSubtasks = await Subtask.findAll({ where: { task_id: id } });
                const existingIds = new Set(existingSubtasks.map(s => s.id));
                const newIds = new Set(subtasks.filter(s => s.id).map(s => s.id));

                // Delete removed subtasks
                const toDelete = existingSubtasks.filter(s => !newIds.has(s.id));
                for (const st of toDelete) {
                    await st.destroy();
                }

                // Update or create subtasks
                for (let i = 0; i < subtasks.length; i++) {
                    const st = subtasks[i];
                    if (st.id && existingIds.has(st.id)) {
                        // Update existing
                        await Subtask.update(
                            { title: st.title, completed: st.completed ?? false, order: st.order ?? i },
                            { where: { id: st.id } }
                        );
                    } else {
                        // Create new
                        await Subtask.create({
                            task_id: id,
                            title: st.title,
                            completed: st.completed || false,
                            order: st.order ?? i
                        });
                    }
                }
            }

            // Reload with subtasks
            const taskWithSubtasks = await Task.findByPk(id, {
                include: [
                    { model: Project, as: 'project', attributes: ['id', 'name'] },
                    { model: Subtask, as: 'subtasks', order: [['order', 'ASC']] }
                ]
            });

            return reply.send({ success: true, data: taskWithSubtasks });
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

    async updateTaskStatus(request, reply) {
        try {
            const { id } = request.params;
            const { status } = request.body;

            const validStatuses = ['BACKLOG', 'TODO', 'DOING', 'DONE'];
            if (!validStatuses.includes(status)) {
                return reply.status(400).send({
                    success: false,
                    error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
                });
            }

            const task = await Task.findByPk(id);
            if (!task) {
                return reply.status(404).send({ success: false, error: 'Task not found' });
            }

            const updateData = { status };
            if (status === 'DONE') {
                updateData.completed_at = getLocalDateString();
            } else if (task.status === 'DONE' && status !== 'DONE') {
                updateData.completed_at = null;
            }

            await task.update(updateData);
            return reply.send({ success: true, data: task });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async getTaskById(request, reply) {
        try {
            const { id } = request.params;

            const task = await Task.findByPk(id, {
                include: [
                    { model: Project, as: 'project', attributes: ['id', 'name'] },
                    { model: Subtask, as: 'subtasks', order: [['order', 'ASC']] }
                ]
            });

            if (!task) {
                return reply.status(404).send({ success: false, error: 'Task not found' });
            }

            return reply.send({ success: true, data: task });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== SUBTASKS ====================

    async toggleSubtask(request, reply) {
        try {
            const { id } = request.params;
            const { completed } = request.body;

            const subtask = await Subtask.findByPk(id);
            if (!subtask) {
                return reply.status(404).send({ success: false, error: 'Subtask not found' });
            }

            await subtask.update({ completed: completed ?? !subtask.completed });
            return reply.send({ success: true, data: subtask });
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

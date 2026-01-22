const { Habit, Routine, RoutineItem, HabitLog, SocialGroup, GroupMember } = require('../models');

class HabitController {
    // ==================== HABITS ====================

    async getHabits(request, reply) {
        try {
            const { userId } = request.params;

            const habits = await Habit.findAll({
                where: { user_id: userId },
                include: [{ model: HabitLog, as: 'logs', limit: 7, order: [['execution_date', 'DESC']] }]
            });

            return reply.send({ success: true, data: habits });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createHabit(request, reply) {
        try {
            const { userId } = request.params;
            const { name, context_tags, ideal_time, frequency, frequency_days } = request.body;

            if (!name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const habit = await Habit.create({
                user_id: userId,
                name,
                context_tags: context_tags || [],
                ideal_time,
                frequency: frequency || 'DAILY',
                frequency_days: frequency_days || []
            });

            return reply.status(201).send({ success: true, data: habit });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async updateHabit(request, reply) {
        try {
            const { id } = request.params;
            const updates = request.body;

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            await habit.update(updates);
            return reply.send({ success: true, data: habit });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async deleteHabit(request, reply) {
        try {
            const { id } = request.params;

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            await habit.destroy();
            return reply.send({ success: true, message: 'Habit deleted' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async logHabit(request, reply) {
        try {
            const { id } = request.params;
            const { status, execution_date } = request.body;

            if (!status) {
                return reply.status(400).send({ success: false, error: 'Status is required' });
            }

            const habit = await Habit.findByPk(id);
            if (!habit) {
                return reply.status(404).send({ success: false, error: 'Habit not found' });
            }

            const log = await HabitLog.create({
                habit_id: id,
                status,
                execution_date: execution_date || new Date()
            });

            if (status === 'DONE') {
                await habit.update({ current_streak: habit.current_streak + 1 });
            } else if (status === 'FAILED') {
                await habit.update({ current_streak: 0 });
            }

            return reply.status(201).send({ success: true, data: log });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== ROUTINES ====================

    async getRoutines(request, reply) {
        try {
            const { userId } = request.params;

            const routines = await Routine.findAll({
                where: { user_id: userId },
                include: [{
                    model: Habit,
                    as: 'habits',
                    through: { attributes: ['execution_order'] }
                }]
            });

            return reply.send({ success: true, data: routines });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createRoutine(request, reply) {
        try {
            const { userId } = request.params;
            const { name, start_time, frequency, frequency_days, habit_ids } = request.body;

            if (!name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const routine = await Routine.create({
                user_id: userId,
                name,
                start_time,
                frequency: frequency || 'DAILY',
                frequency_days: frequency_days || []
            });

            if (habit_ids && habit_ids.length > 0) {
                const items = habit_ids.map((habitId, index) => ({
                    routine_id: routine.id,
                    habit_id: habitId,
                    execution_order: index
                }));
                await RoutineItem.bulkCreate(items);
            }

            return reply.status(201).send({ success: true, data: routine });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async updateRoutine(request, reply) {
        try {
            const { id } = request.params;
            const { habit_ids, ...updates } = request.body;

            const routine = await Routine.findByPk(id);
            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            await routine.update(updates);

            if (habit_ids) {
                await RoutineItem.destroy({ where: { routine_id: id } });
                const items = habit_ids.map((habitId, index) => ({
                    routine_id: id,
                    habit_id: habitId,
                    execution_order: index
                }));
                await RoutineItem.bulkCreate(items);
            }

            return reply.send({ success: true, data: routine });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async deleteRoutine(request, reply) {
        try {
            const { id } = request.params;

            const routine = await Routine.findByPk(id);
            if (!routine) {
                return reply.status(404).send({ success: false, error: 'Routine not found' });
            }

            await routine.destroy();
            return reply.send({ success: true, message: 'Routine deleted' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    // ==================== SOCIAL GROUPS ====================

    async getSocialGroups(request, reply) {
        try {
            const groups = await SocialGroup.findAll({
                include: [{
                    model: GroupMember,
                    as: 'members',
                    attributes: ['user_id', 'current_score']
                }]
            });

            return reply.send({ success: true, data: groups });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async createSocialGroup(request, reply) {
        try {
            const { name, ranking_logic } = request.body;

            if (!name) {
                return reply.status(400).send({ success: false, error: 'Name is required' });
            }

            const group = await SocialGroup.create({
                name,
                ranking_logic: ranking_logic || 'POINTS'
            });

            return reply.status(201).send({ success: true, data: group });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async joinGroup(request, reply) {
        try {
            const { id } = request.params;
            const { user_id } = request.body;

            if (!user_id) {
                return reply.status(400).send({ success: false, error: 'user_id is required' });
            }

            const [member, created] = await GroupMember.findOrCreate({
                where: { group_id: id, user_id },
                defaults: { group_id: id, user_id, current_score: 0 }
            });

            return reply.status(created ? 201 : 200).send({
                success: true,
                data: member,
                created
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async leaveGroup(request, reply) {
        try {
            const { id } = request.params;
            const { user_id } = request.body;

            const member = await GroupMember.findOne({
                where: { group_id: id, user_id }
            });

            if (!member) {
                return reply.status(404).send({ success: false, error: 'Member not found' });
            }

            await member.destroy();
            return reply.send({ success: true, message: 'Left group' });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }

    async getGroupRanking(request, reply) {
        try {
            const { id } = request.params;

            const members = await GroupMember.findAll({
                where: { group_id: id },
                order: [['current_score', 'DESC']],
                include: [{ model: require('../models').User, as: 'user', attributes: ['id', 'name', 'avatar_url'] }]
            });

            return reply.send({ success: true, data: members });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ success: false, error: error.message });
        }
    }
}

module.exports = new HabitController();

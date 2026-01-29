const SocialSettings = require('../models/SocialSettings');
const SocialCircle = require('../models/SocialCircle');

const DEFAULT_CIRCLES = [
    { name: 'Família', icon: '👨‍👩‍👧‍👦', color: '#EF4444', priority: 'HIGH', sort_order: 1 },
    { name: 'Amigos Próximos', icon: '👫', color: '#3B82F6', priority: 'HIGH', sort_order: 2 },
    { name: 'Colegas', icon: '🤝', color: '#10B981', priority: 'MEDIUM', sort_order: 3 },
    { name: 'Networking', icon: '💼', color: '#8B5CF6', priority: 'MEDIUM', sort_order: 4 },
    { name: 'Conhecidos', icon: '👋', color: '#6B7280', priority: 'LOW', sort_order: 5 },
];

async function getSettings(request, reply) {
    try {
        const { userId } = request.params;

        let settings = await SocialSettings.findOne({ where: { user_id: userId } });

        if (!settings) {
            settings = await SocialSettings.create({ user_id: userId });

            // Create default circles
            for (const circle of DEFAULT_CIRCLES) {
                await SocialCircle.create({
                    user_id: userId,
                    ...circle,
                    is_default: true,
                });
            }
        }

        return { success: true, data: settings };
    } catch (error) {
        console.error('Error getting social settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

async function updateSettings(request, reply) {
    try {
        const { userId } = request.params;
        const data = request.body;

        let settings = await SocialSettings.findOne({ where: { user_id: userId } });

        if (!settings) {
            settings = await SocialSettings.create({ user_id: userId, ...data });
        } else {
            await settings.update(data);
        }

        return { success: true, data: settings };
    } catch (error) {
        console.error('Error updating social settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
}

module.exports = {
    getSettings,
    updateSettings,
};

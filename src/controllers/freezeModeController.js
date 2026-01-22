const { FreezeModeConfig } = require('../models');

const getFreezeModeConfig = async (request, reply) => {
    try {
        const { userId } = request.params;
        let config = await FreezeModeConfig.findOne({
            where: { user_id: userId }
        });

        if (!config) {
            config = await FreezeModeConfig.create({
                user_id: userId,
                is_active: false
            });
        }

        return { success: true, data: config };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateFreezeModeConfig = async (request, reply) => {
    try {
        const { userId } = request.params;
        let config = await FreezeModeConfig.findOne({
            where: { user_id: userId }
        });

        if (!config) {
            config = await FreezeModeConfig.create({
                ...request.body,
                user_id: userId
            });
            reply.status(201);
            return { success: true, data: config, created: true };
        }

        await config.update(request.body);
        return { success: true, data: config };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const activateFreezeMode = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { end_date, reason } = request.body;

        let config = await FreezeModeConfig.findOne({
            where: { user_id: userId }
        });

        if (!config) {
            config = await FreezeModeConfig.create({
                user_id: userId,
                is_active: true,
                start_date: new Date(),
                end_date,
                reason
            });
        } else {
            await config.update({
                is_active: true,
                start_date: new Date(),
                end_date,
                reason
            });
        }

        return { success: true, data: config };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deactivateFreezeMode = async (request, reply) => {
    try {
        const { userId } = request.params;

        const config = await FreezeModeConfig.findOne({
            where: { user_id: userId }
        });

        if (!config) {
            reply.status(404);
            return { success: false, error: 'Freeze mode config not found' };
        }

        await config.update({
            is_active: false,
            end_date: new Date()
        });

        return { success: true, data: config };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getFreezeModeConfig,
    updateFreezeModeConfig,
    activateFreezeMode,
    deactivateFreezeMode
};

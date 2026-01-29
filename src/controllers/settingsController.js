const UserModule = require('../models/UserModule');
const AppearanceSettings = require('../models/AppearanceSettings');
const NotificationSettings = require('../models/NotificationSettings');
const PreferenceSettings = require('../models/PreferenceSettings');

// Default modules configuration
const ALL_MODULES = ['HABITS', 'TASKS', 'FINANCE', 'HEALTH', 'STUDIES', 'WORK', 'SOCIAL', 'HOME'];

// ==================== USER MODULES ====================

const getModules = async (request, reply) => {
    try {
        const { userId } = request.params;

        let modules = await UserModule.findAll({
            where: { userId },
            order: [['moduleType', 'ASC']],
        });

        // Create defaults if none exist
        if (modules.length === 0) {
            const modulesToCreate = ALL_MODULES.map((moduleType) => ({
                userId,
                moduleType,
                isActive: true,
            }));
            modules = await UserModule.bulkCreate(modulesToCreate);
        }

        return reply.send({ success: true, data: modules });
    } catch (error) {
        console.error('Error getting modules:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const toggleModule = async (request, reply) => {
    try {
        const { userId, moduleType } = request.params;
        const { isActive } = request.body;

        let module = await UserModule.findOne({
            where: { userId, moduleType },
        });

        if (!module) {
            module = await UserModule.create({
                userId,
                moduleType,
                isActive,
            });
        } else {
            await module.update({ isActive });
        }

        return reply.send({ success: true, data: module });
    } catch (error) {
        console.error('Error toggling module:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== APPEARANCE SETTINGS ====================

const getAppearance = async (request, reply) => {
    try {
        const { userId } = request.params;

        let settings = await AppearanceSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await AppearanceSettings.create({ userId });
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error getting appearance settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const updateAppearance = async (request, reply) => {
    try {
        const { userId } = request.params;
        const updateData = request.body;

        let settings = await AppearanceSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await AppearanceSettings.create({ userId, ...updateData });
        } else {
            await settings.update(updateData);
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating appearance settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== NOTIFICATION SETTINGS ====================

const getNotifications = async (request, reply) => {
    try {
        const { userId } = request.params;

        let settings = await NotificationSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await NotificationSettings.create({ userId });
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error getting notification settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const updateNotifications = async (request, reply) => {
    try {
        const { userId } = request.params;
        const updateData = request.body;

        let settings = await NotificationSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await NotificationSettings.create({ userId, ...updateData });
        } else {
            await settings.update(updateData);
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating notification settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== PREFERENCE SETTINGS ====================

const getPreferences = async (request, reply) => {
    try {
        const { userId } = request.params;

        let settings = await PreferenceSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await PreferenceSettings.create({ userId });
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error getting preference settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

const updatePreferences = async (request, reply) => {
    try {
        const { userId } = request.params;
        const updateData = request.body;

        let settings = await PreferenceSettings.findOne({ where: { userId } });

        if (!settings) {
            settings = await PreferenceSettings.create({ userId, ...updateData });
        } else {
            await settings.update(updateData);
        }

        return reply.send({ success: true, data: settings });
    } catch (error) {
        console.error('Error updating preference settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

// ==================== ALL SETTINGS ====================

const getAllSettings = async (request, reply) => {
    try {
        const { userId } = request.params;

        const [modules, appearance, notifications, preferences] = await Promise.all([
            UserModule.findAll({ where: { userId } }),
            AppearanceSettings.findOne({ where: { userId } }),
            NotificationSettings.findOne({ where: { userId } }),
            PreferenceSettings.findOne({ where: { userId } }),
        ]);

        // Create defaults if needed
        let finalModules = modules;
        if (modules.length === 0) {
            finalModules = await UserModule.bulkCreate(
                ALL_MODULES.map((moduleType) => ({ userId, moduleType, isActive: true }))
            );
        }

        const finalAppearance = appearance || await AppearanceSettings.create({ userId });
        const finalNotifications = notifications || await NotificationSettings.create({ userId });
        const finalPreferences = preferences || await PreferenceSettings.create({ userId });

        return reply.send({
            success: true,
            data: {
                modules: finalModules,
                appearance: finalAppearance,
                notifications: finalNotifications,
                preferences: finalPreferences,
            },
        });
    } catch (error) {
        console.error('Error getting all settings:', error);
        return reply.status(500).send({ success: false, error: error.message });
    }
};

module.exports = {
    getModules,
    toggleModule,
    getAppearance,
    updateAppearance,
    getNotifications,
    updateNotifications,
    getPreferences,
    updatePreferences,
    getAllSettings,
};

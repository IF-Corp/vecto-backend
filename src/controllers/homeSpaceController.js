const { HomeSpace, HomeSpaceModule } = require('../models');

// Default modules for new spaces
const DEFAULT_MODULES = ['ROUTINE', 'MAINTENANCE', 'SHOPPING', 'STOCK'];

// ==================== SPACES ====================

const getSpaces = async (request, reply) => {
    try {
        const { userId } = request.params;
        const spaces = await HomeSpace.findAll({
            where: { user_id: userId },
            include: [{ model: HomeSpaceModule, as: 'modules' }],
            order: [['created_at', 'DESC']],
        });
        return { success: true, data: spaces };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getSpace = async (request, reply) => {
    try {
        const { id } = request.params;
        const space = await HomeSpace.findByPk(id, {
            include: [{ model: HomeSpaceModule, as: 'modules' }],
        });
        if (!space) {
            reply.status(404);
            return { success: false, error: 'Space not found' };
        }
        return { success: true, data: space };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const createSpace = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { name, type, address, enabledModules } = request.body;

        const space = await HomeSpace.create({
            user_id: userId,
            name,
            type: type || 'APARTMENT',
            address,
        });

        // Create default or specified modules
        const modulesToCreate = enabledModules || DEFAULT_MODULES;
        await Promise.all(
            modulesToCreate.map((moduleType) =>
                HomeSpaceModule.create({
                    space_id: space.id,
                    module_type: moduleType,
                    is_enabled: true,
                })
            )
        );

        const spaceWithModules = await HomeSpace.findByPk(space.id, {
            include: [{ model: HomeSpaceModule, as: 'modules' }],
        });

        reply.status(201);
        return { success: true, data: spaceWithModules, created: true };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateSpace = async (request, reply) => {
    try {
        const { id } = request.params;
        const [updated] = await HomeSpace.update(request.body, { where: { id } });
        if (!updated) {
            reply.status(404);
            return { success: false, error: 'Space not found' };
        }
        const space = await HomeSpace.findByPk(id, {
            include: [{ model: HomeSpaceModule, as: 'modules' }],
        });
        return { success: true, data: space };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const deleteSpace = async (request, reply) => {
    try {
        const { id } = request.params;
        const deleted = await HomeSpace.destroy({ where: { id } });
        if (!deleted) {
            reply.status(404);
            return { success: false, error: 'Space not found' };
        }
        return { success: true, data: { deleted: true } };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== SPACE MODULES ====================

const updateSpaceModules = async (request, reply) => {
    try {
        const { id } = request.params;
        const { modules } = request.body;

        // Delete existing modules
        await HomeSpaceModule.destroy({ where: { space_id: id } });

        // Create new modules
        await Promise.all(
            modules.map((mod) =>
                HomeSpaceModule.create({
                    space_id: id,
                    module_type: mod.module_type,
                    is_enabled: mod.is_enabled !== false,
                    settings: mod.settings || null,
                })
            )
        );

        const space = await HomeSpace.findByPk(id, {
            include: [{ model: HomeSpaceModule, as: 'modules' }],
        });

        return { success: true, data: space };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const toggleSpaceModule = async (request, reply) => {
    try {
        const { id, moduleType } = request.params;
        const { is_enabled } = request.body;

        const [module] = await HomeSpaceModule.findOrCreate({
            where: { space_id: id, module_type: moduleType },
            defaults: { is_enabled },
        });

        if (module) {
            await module.update({ is_enabled });
        }

        return { success: true, data: module };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    getSpaces,
    getSpace,
    createSpace,
    updateSpace,
    deleteSpace,
    updateSpaceModules,
    toggleSpaceModule,
};

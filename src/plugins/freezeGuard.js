const fp = require('fastify-plugin');

// Map first URL segment (after /api/ or /api/users/:uuid/) to freeze module type
const SEGMENT_TO_MODULE = {
    // HABITS
    'habits': 'HABITS',

    // TASKS (productivity)
    'projects': 'TASKS',

    // FINANCE
    'accounts': 'FINANCE',
    'cards': 'FINANCE',
    'transactions': 'FINANCE',
    'invoices': 'FINANCE',
    'categories': 'FINANCE',
    'recurring-expenses': 'FINANCE',
    'budgets': 'FINANCE',
    'goals': 'FINANCE',
    'investments': 'FINANCE',
    'finance-profile': 'FINANCE',

    // HEALTH
    'health-profile': 'HEALTH',
    'weight': 'HEALTH',
    'meals': 'HEALTH',
    'workouts': 'HEALTH',
    'workout-details': 'HEALTH',
    'medications': 'HEALTH',
    'medication-logs': 'HEALTH',
    'sleep': 'HEALTH',
    'diets': 'HEALTH',

    // STUDIES
    'study': 'STUDIES',

    // WORK
    'work': 'WORK',
    'work-modes': 'WORK',
    'daily-standup': 'WORK',
    'weekly-plan': 'WORK',
    'end-of-day': 'WORK',

    // SOCIAL
    'social': 'SOCIAL',

    // HOME
    'spaces': 'HOME',
    'shopping': 'HOME',
};

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// In-memory cache: userId -> { modules: string[], timestamp: number }
const freezeCache = new Map();
const CACHE_TTL = 60 * 1000; // 60 seconds

function extractModuleFromUrl(url) {
    const path = url.split('?')[0];
    const segments = path.split('/').filter(Boolean);

    if (segments.length < 2) return null;

    let idx = 0;
    if (segments[idx] === 'api') idx++;

    // /api/users/:userId/[segment]/...
    if (segments[idx] === 'users') {
        idx++; // skip 'users'
        idx++; // skip :userId
        if (idx >= segments.length) return null;
    }

    return SEGMENT_TO_MODULE[segments[idx]] || null;
}

async function getActiveFrozenModules(userId, FreezePeriod, FreezeModule) {
    const cacheKey = userId;
    const cached = freezeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.modules;
    }

    const activePeriod = await FreezePeriod.findOne({
        where: {
            user_id: userId,
            status: 'ACTIVE'
        },
        include: [{
            model: FreezeModule,
            as: 'modules',
            attributes: ['module_type']
        }]
    });

    const frozenModules = activePeriod
        ? activePeriod.modules.map(m => m.module_type)
        : [];

    freezeCache.set(cacheKey, {
        modules: frozenModules,
        timestamp: Date.now()
    });

    return frozenModules;
}

async function freezeGuardPlugin(fastify, opts) {
    const FreezePeriod = require('../models/FreezePeriod');
    const FreezeModule = require('../models/FreezeModule');

    // Decorator to clear cache (called when freeze status changes)
    fastify.decorate('clearFreezeCache', function (userId) {
        if (userId) {
            freezeCache.delete(userId);
        } else {
            freezeCache.clear();
        }
    });

    fastify.addHook('onRequest', async function freezeGuardHook(request, reply) {
        // Only block write operations
        if (!WRITE_METHODS.has(request.method)) return;

        // Detect module from URL
        const moduleType = extractModuleFromUrl(request.url);
        if (!moduleType) return;

        // Verify JWT to get user identity
        try {
            await request.jwtVerify();
        } catch {
            // Auth will reject later in the preHandler chain
            return;
        }

        const userId = request.user?.id;
        if (!userId) return;

        const frozenModules = await getActiveFrozenModules(userId, FreezePeriod, FreezeModule);

        if (frozenModules.includes(moduleType)) {
            return reply.status(423).send({
                success: false,
                error: 'ModuleFrozen',
                message: 'Este módulo está pausado no Modo Congelar',
                module: moduleType
            });
        }
    });
}

module.exports = fp(freezeGuardPlugin, {
    name: 'freeze-guard-plugin',
    dependencies: ['auth-plugin']
});

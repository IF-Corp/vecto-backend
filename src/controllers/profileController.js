const {
    User,
    UserProfile,
    UserXp,
    XpLevel,
    XpLog,
    Achievement,
    UserAchievement,
    Title,
    UserTitle
} = require('../models');
const { Op } = require('sequelize');
const storageService = require('../services/storageService');

// ==================== PROFILE ====================

const getProfile = async (request, reply) => {
    try {
        const { userId } = request.params;

        const user = await User.findByPk(userId, {
            attributes: ['id', 'name', 'email', 'nickname', 'created_at']
        });

        if (!user) {
            reply.status(404);
            return { success: false, error: 'User not found' };
        }

        let profile = await UserProfile.findOne({
            where: { user_id: userId }
        });

        if (!profile) {
            profile = await UserProfile.create({
                user_id: userId
            });
        }

        // Get XP and level info if gamification enabled
        let xpData = null;
        let activeTitle = null;

        if (profile.gamification_enabled) {
            let userXp = await UserXp.findOne({ where: { user_id: userId } });
            if (!userXp) {
                userXp = await UserXp.create({ user_id: userId });
            }

            const currentLevel = await XpLevel.findOne({
                where: { level: userXp.current_level }
            });

            const nextLevel = await XpLevel.findOne({
                where: { level: userXp.current_level + 1 }
            });

            xpData = {
                totalXp: userXp.total_xp,
                currentLevel: userXp.current_level,
                levelName: currentLevel?.name || 'Iniciante',
                levelIcon: currentLevel?.icon || '⭐',
                xpForNextLevel: nextLevel?.min_xp || null,
                nextLevelName: nextLevel?.name || null
            };

            // Get active title
            const userActiveTitle = await UserTitle.findOne({
                where: { user_id: userId, is_active: true },
                include: [{ model: Title, as: 'title' }]
            });

            if (userActiveTitle) {
                activeTitle = {
                    id: userActiveTitle.title.id,
                    name: userActiveTitle.title.name,
                    rarity: userActiveTitle.title.rarity
                };
            }
        }

        return {
            success: true,
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    nickname: user.nickname,
                    memberSince: user.created_at
                },
                profile: {
                    id: profile.id,
                    photoUrl: profile.photo_url,
                    bio: profile.bio,
                    phone: profile.phone,
                    location: profile.location,
                    birthDate: profile.birth_date,
                    timezone: profile.timezone,
                    gamificationEnabled: profile.gamification_enabled
                },
                xp: xpData,
                activeTitle
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const updateProfile = async (request, reply) => {
    try {
        const { userId } = request.params;
        const {
            photo_url,
            bio,
            phone,
            location,
            birth_date,
            timezone,
            gamification_enabled
        } = request.body;

        let profile = await UserProfile.findOne({
            where: { user_id: userId }
        });

        if (!profile) {
            profile = await UserProfile.create({
                user_id: userId,
                photo_url,
                bio,
                phone,
                location,
                birth_date,
                timezone,
                gamification_enabled
            });
            reply.status(201);
            return { success: true, data: profile, created: true };
        }

        await profile.update({
            photo_url: photo_url !== undefined ? photo_url : profile.photo_url,
            bio: bio !== undefined ? bio : profile.bio,
            phone: phone !== undefined ? phone : profile.phone,
            location: location !== undefined ? location : profile.location,
            birth_date: birth_date !== undefined ? birth_date : profile.birth_date,
            timezone: timezone !== undefined ? timezone : profile.timezone,
            gamification_enabled: gamification_enabled !== undefined ? gamification_enabled : profile.gamification_enabled
        });

        return { success: true, data: profile };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== STATISTICS ====================

const getProfileStats = async (request, reply) => {
    try {
        const { userId } = request.params;

        // Get basic stats from various modules
        // These would be calculated from actual data in a real implementation
        const stats = {
            activeDays: 0,
            maxStreak: 0,
            currentStreak: 0,
            totalFocusTime: 0,
            totalTasksCompleted: 0,
            habitsCompletionRate: 0,
            totalAchievements: 0,
            averageModuleScore: 0
        };

        // Count achievements
        const achievementCount = await UserAchievement.count({
            where: { user_id: userId }
        });
        stats.totalAchievements = achievementCount;

        return { success: true, data: stats };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== XP & LEVELS ====================

const getXpProgress = async (request, reply) => {
    try {
        const { userId } = request.params;

        let userXp = await UserXp.findOne({ where: { user_id: userId } });
        if (!userXp) {
            userXp = await UserXp.create({ user_id: userId });
        }

        const currentLevel = await XpLevel.findOne({
            where: { level: userXp.current_level }
        });

        const nextLevel = await XpLevel.findOne({
            where: { level: userXp.current_level + 1 }
        });

        const xpInCurrentLevel = userXp.total_xp - (currentLevel?.min_xp || 0);
        const xpNeededForNext = (nextLevel?.min_xp || currentLevel?.max_xp || 100) - (currentLevel?.min_xp || 0);
        const progressPercent = Math.min(100, (xpInCurrentLevel / xpNeededForNext) * 100);

        return {
            success: true,
            data: {
                totalXp: userXp.total_xp,
                currentLevel: userXp.current_level,
                levelName: currentLevel?.name || 'Iniciante',
                levelIcon: currentLevel?.icon || '⭐',
                xpInCurrentLevel,
                xpNeededForNext,
                progressPercent: Math.round(progressPercent),
                nextLevel: nextLevel ? {
                    level: nextLevel.level,
                    name: nextLevel.name,
                    minXp: nextLevel.min_xp
                } : null
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const addXp = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { amount, source, source_id, description } = request.body;

        let userXp = await UserXp.findOne({ where: { user_id: userId } });
        if (!userXp) {
            userXp = await UserXp.create({ user_id: userId });
        }

        const newTotalXp = userXp.total_xp + amount;

        // Check for level up
        const newLevel = await XpLevel.findOne({
            where: {
                min_xp: { [Op.lte]: newTotalXp },
                max_xp: { [Op.gt]: newTotalXp }
            }
        });

        const leveledUp = newLevel && newLevel.level > userXp.current_level;

        await userXp.update({
            total_xp: newTotalXp,
            current_level: newLevel?.level || userXp.current_level
        });

        // Log the XP gain
        await XpLog.create({
            user_id: userId,
            xp_amount: amount,
            source,
            source_id,
            description
        });

        return {
            success: true,
            data: {
                xpAdded: amount,
                totalXp: newTotalXp,
                currentLevel: userXp.current_level,
                leveledUp,
                newLevel: leveledUp ? {
                    level: newLevel.level,
                    name: newLevel.name
                } : null
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getXpHistory = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { limit = 20, offset = 0 } = request.query;

        const logs = await XpLog.findAndCountAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        return {
            success: true,
            data: logs.rows,
            total: logs.count,
            limit: parseInt(limit),
            offset: parseInt(offset)
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== ACHIEVEMENTS ====================

const getAchievements = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { category } = request.query;

        const where = {};
        if (category) {
            where.category = category;
        }

        const achievements = await Achievement.findAll({
            where,
            order: [['category', 'ASC'], ['rarity', 'ASC']]
        });

        const userAchievements = await UserAchievement.findAll({
            where: { user_id: userId }
        });

        const userAchievementMap = new Map(
            userAchievements.map(ua => [ua.achievement_id, ua])
        );

        const enrichedAchievements = achievements.map(a => ({
            id: a.id,
            code: a.code,
            name: a.name,
            description: a.description,
            category: a.category,
            rarity: a.rarity,
            icon: a.icon,
            xpReward: a.xp_reward,
            isHidden: a.is_hidden,
            unlocked: userAchievementMap.has(a.id),
            unlockedAt: userAchievementMap.get(a.id)?.unlocked_at || null,
            progress: userAchievementMap.get(a.id)?.progress || 0,
            conditionValue: a.condition_value
        }));

        return { success: true, data: enrichedAchievements };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getUserAchievements = async (request, reply) => {
    try {
        const { userId } = request.params;

        const userAchievements = await UserAchievement.findAll({
            where: { user_id: userId },
            include: [{ model: Achievement, as: 'achievement' }],
            order: [['unlocked_at', 'DESC']]
        });

        return {
            success: true,
            data: userAchievements.map(ua => ({
                id: ua.id,
                achievement: {
                    id: ua.achievement.id,
                    code: ua.achievement.code,
                    name: ua.achievement.name,
                    description: ua.achievement.description,
                    category: ua.achievement.category,
                    rarity: ua.achievement.rarity,
                    icon: ua.achievement.icon,
                    xpReward: ua.achievement.xp_reward
                },
                unlockedAt: ua.unlocked_at,
                isFeatured: ua.is_featured
            }))
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== TITLES ====================

const getTitles = async (request, reply) => {
    try {
        const { userId } = request.params;

        const titles = await Title.findAll({
            order: [['rarity', 'ASC'], ['name', 'ASC']]
        });

        const userTitles = await UserTitle.findAll({
            where: { user_id: userId }
        });

        const userTitleMap = new Map(
            userTitles.map(ut => [ut.title_id, ut])
        );

        const enrichedTitles = titles.map(t => ({
            id: t.id,
            code: t.code,
            name: t.name,
            description: t.description,
            rarity: t.rarity,
            unlockCondition: t.unlock_condition,
            requiredLevel: t.required_level,
            unlocked: userTitleMap.has(t.id),
            unlockedAt: userTitleMap.get(t.id)?.unlocked_at || null,
            isActive: userTitleMap.get(t.id)?.is_active || false
        }));

        return { success: true, data: enrichedTitles };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const getUserTitles = async (request, reply) => {
    try {
        const { userId } = request.params;

        const userTitles = await UserTitle.findAll({
            where: { user_id: userId },
            include: [{ model: Title, as: 'title' }],
            order: [['unlocked_at', 'DESC']]
        });

        return {
            success: true,
            data: userTitles.map(ut => ({
                id: ut.id,
                title: {
                    id: ut.title.id,
                    code: ut.title.code,
                    name: ut.title.name,
                    rarity: ut.title.rarity
                },
                unlockedAt: ut.unlocked_at,
                isActive: ut.is_active
            }))
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const setActiveTitle = async (request, reply) => {
    try {
        const { userId, titleId } = request.params;

        // Verify user has this title
        const userTitle = await UserTitle.findOne({
            where: { user_id: userId, title_id: titleId }
        });

        if (!userTitle) {
            reply.status(404);
            return { success: false, error: 'Title not unlocked' };
        }

        // Deactivate all other titles
        await UserTitle.update(
            { is_active: false },
            { where: { user_id: userId } }
        );

        // Activate the selected title
        await userTitle.update({ is_active: true });

        const title = await Title.findByPk(titleId);

        return {
            success: true,
            data: {
                id: userTitle.id,
                title: {
                    id: title.id,
                    code: title.code,
                    name: title.name,
                    rarity: title.rarity
                },
                isActive: true
            }
        };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

const removeActiveTitle = async (request, reply) => {
    try {
        const { userId } = request.params;

        await UserTitle.update(
            { is_active: false },
            { where: { user_id: userId } }
        );

        return { success: true, message: 'Title removed' };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

// ==================== PHOTO UPLOAD ====================

const uploadPhoto = async (request, reply) => {
    try {
        const { userId } = request.params;
        const { image } = request.body;

        if (!image) {
            reply.status(400);
            return { success: false, error: 'No image provided' };
        }

        // Process and validate the image
        const { dataUrl, mimeType, size } = storageService.processImage(image);

        // Get or create profile
        let profile = await UserProfile.findOne({
            where: { user_id: userId }
        });

        if (!profile) {
            profile = await UserProfile.create({
                user_id: userId,
                photo_url: dataUrl
            });
        } else {
            await profile.update({ photo_url: dataUrl });
        }

        return {
            success: true,
            data: {
                photoUrl: dataUrl,
                mimeType,
                size
            }
        };
    } catch (error) {
        reply.status(error.message.includes('Invalid') || error.message.includes('too large') ? 400 : 500);
        return { success: false, error: error.message };
    }
};

const deletePhoto = async (request, reply) => {
    try {
        const { userId } = request.params;

        const profile = await UserProfile.findOne({
            where: { user_id: userId }
        });

        if (!profile) {
            reply.status(404);
            return { success: false, error: 'Profile not found' };
        }

        await profile.update({ photo_url: null });

        return { success: true, message: 'Photo deleted successfully' };
    } catch (error) {
        reply.status(500);
        return { success: false, error: error.message };
    }
};

module.exports = {
    // Profile
    getProfile,
    updateProfile,
    getProfileStats,
    uploadPhoto,
    deletePhoto,
    // XP & Levels
    getXpProgress,
    addXp,
    getXpHistory,
    // Achievements
    getAchievements,
    getUserAchievements,
    // Titles
    getTitles,
    getUserTitles,
    setActiveTitle,
    removeActiveTitle
};

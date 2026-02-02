/**
 * Gamification Service
 * Handles achievement unlocking, XP rewards, and title unlocking
 */

const {
    Achievement,
    UserAchievement,
    Title,
    UserTitle,
    UserXp,
    XpLevel,
    XpLog,
    UserProfile
} = require('../models');
const { Op } = require('sequelize');

class GamificationService {
    /**
     * Check and unlock achievements based on condition type and value
     * @param {string} userId - User ID
     * @param {string} conditionType - Type of condition (e.g., 'TASK_COMPLETE', 'HABIT_STREAK')
     * @param {number} currentValue - Current value to check against
     * @returns {Promise<Array>} - Array of unlocked achievements
     */
    async checkAchievements(userId, conditionType, currentValue) {
        // Check if gamification is enabled for user
        const profile = await UserProfile.findOne({ where: { user_id: userId } });
        if (!profile?.gamification_enabled) {
            return [];
        }

        // Find all achievements matching the condition type
        const achievements = await Achievement.findAll({
            where: {
                condition_type: conditionType,
                condition_value: { [Op.lte]: currentValue }
            }
        });

        if (achievements.length === 0) {
            return [];
        }

        // Get already unlocked achievements
        const unlockedIds = await UserAchievement.findAll({
            where: {
                user_id: userId,
                achievement_id: { [Op.in]: achievements.map(a => a.id) }
            },
            attributes: ['achievement_id']
        });

        const unlockedSet = new Set(unlockedIds.map(ua => ua.achievement_id));

        // Filter to only new achievements
        const newAchievements = achievements.filter(a => !unlockedSet.has(a.id));

        if (newAchievements.length === 0) {
            return [];
        }

        // Unlock new achievements
        const unlocked = [];
        for (const achievement of newAchievements) {
            await UserAchievement.create({
                user_id: userId,
                achievement_id: achievement.id,
                unlocked_at: new Date(),
                progress: currentValue
            });

            // Award XP
            await this.addXp(userId, achievement.xp_reward, 'ACHIEVEMENT', achievement.id, `Achievement: ${achievement.name}`);

            unlocked.push({
                id: achievement.id,
                code: achievement.code,
                name: achievement.name,
                description: achievement.description,
                rarity: achievement.rarity,
                icon: achievement.icon,
                xpReward: achievement.xp_reward
            });
        }

        // Check for milestone achievements (achievement count)
        if (conditionType !== 'ACHIEVEMENT_COUNT') {
            const totalUnlocked = await UserAchievement.count({ where: { user_id: userId } });
            const milestoneUnlocked = await this.checkAchievements(userId, 'ACHIEVEMENT_COUNT', totalUnlocked);
            unlocked.push(...milestoneUnlocked);
        }

        return unlocked;
    }

    /**
     * Update achievement progress without unlocking
     * @param {string} userId - User ID
     * @param {string} achievementCode - Achievement code
     * @param {number} progress - Current progress value
     */
    async updateProgress(userId, achievementCode, progress) {
        const achievement = await Achievement.findOne({ where: { code: achievementCode } });
        if (!achievement) return;

        const userAchievement = await UserAchievement.findOne({
            where: { user_id: userId, achievement_id: achievement.id }
        });

        if (userAchievement && !userAchievement.unlocked_at) {
            await userAchievement.update({ progress });
        } else if (!userAchievement) {
            await UserAchievement.create({
                user_id: userId,
                achievement_id: achievement.id,
                progress
            });
        }
    }

    /**
     * Add XP to user and check for level up
     * @param {string} userId - User ID
     * @param {number} amount - XP amount to add
     * @param {string} source - Source of XP (e.g., 'TASK_COMPLETE', 'ACHIEVEMENT')
     * @param {string} sourceId - Optional ID of the source item
     * @param {string} description - Optional description
     * @returns {Promise<Object>} - XP result with level up info
     */
    async addXp(userId, amount, source, sourceId = null, description = null) {
        // Check if gamification is enabled
        const profile = await UserProfile.findOne({ where: { user_id: userId } });
        if (!profile?.gamification_enabled) {
            return { xpAdded: 0, leveledUp: false };
        }

        let userXp = await UserXp.findOne({ where: { user_id: userId } });
        if (!userXp) {
            userXp = await UserXp.create({ user_id: userId, total_xp: 0, current_level: 1 });
        }

        const newTotalXp = userXp.total_xp + amount;
        const oldLevel = userXp.current_level;

        // Find new level
        const newLevel = await XpLevel.findOne({
            where: {
                min_xp: { [Op.lte]: newTotalXp },
                max_xp: { [Op.gte]: newTotalXp }
            }
        });

        const leveledUp = newLevel && newLevel.level > oldLevel;

        await userXp.update({
            total_xp: newTotalXp,
            current_level: newLevel?.level || oldLevel
        });

        // Log XP gain
        await XpLog.create({
            user_id: userId,
            xp_amount: amount,
            source,
            source_id: sourceId,
            description
        });

        // If leveled up, check for level-based achievements and titles
        if (leveledUp) {
            await this.checkAchievements(userId, 'LEVEL_REACH', newLevel.level);
            await this.checkTitleUnlocks(userId);
        }

        return {
            xpAdded: amount,
            totalXp: newTotalXp,
            currentLevel: newLevel?.level || oldLevel,
            leveledUp,
            newLevel: leveledUp ? {
                level: newLevel.level,
                name: newLevel.name,
                icon: newLevel.icon
            } : null
        };
    }

    /**
     * Check and unlock titles based on level and achievements
     * @param {string} userId - User ID
     * @returns {Promise<Array>} - Array of unlocked titles
     */
    async checkTitleUnlocks(userId) {
        const profile = await UserProfile.findOne({ where: { user_id: userId } });
        if (!profile?.gamification_enabled) {
            return [];
        }

        const userXp = await UserXp.findOne({ where: { user_id: userId } });
        const currentLevel = userXp?.current_level || 1;

        // Find titles that can be unlocked by level
        const levelTitles = await Title.findAll({
            where: {
                required_level: { [Op.lte]: currentLevel },
                required_achievement_id: null
            }
        });

        // Get already unlocked titles
        const unlockedTitleIds = await UserTitle.findAll({
            where: {
                user_id: userId,
                title_id: { [Op.in]: levelTitles.map(t => t.id) }
            },
            attributes: ['title_id']
        });

        const unlockedSet = new Set(unlockedTitleIds.map(ut => ut.title_id));

        // Filter to new titles
        const newTitles = levelTitles.filter(t => !unlockedSet.has(t.id));

        const unlocked = [];
        for (const title of newTitles) {
            await UserTitle.create({
                user_id: userId,
                title_id: title.id,
                unlocked_at: new Date(),
                is_active: false
            });

            unlocked.push({
                id: title.id,
                code: title.code,
                name: title.name,
                rarity: title.rarity
            });
        }

        return unlocked;
    }

    /**
     * Get user's gamification summary
     * @param {string} userId - User ID
     * @returns {Promise<Object>} - Gamification summary
     */
    async getSummary(userId) {
        const [userXp, achievementCount, titleCount] = await Promise.all([
            UserXp.findOne({ where: { user_id: userId } }),
            UserAchievement.count({ where: { user_id: userId } }),
            UserTitle.count({ where: { user_id: userId } })
        ]);

        const currentLevel = await XpLevel.findOne({
            where: { level: userXp?.current_level || 1 }
        });

        return {
            totalXp: userXp?.total_xp || 0,
            currentLevel: userXp?.current_level || 1,
            levelName: currentLevel?.name || 'Iniciante',
            levelIcon: currentLevel?.icon || '🌱',
            achievementsUnlocked: achievementCount,
            titlesUnlocked: titleCount
        };
    }

    /**
     * Award first login achievement
     * @param {string} userId - User ID
     */
    async awardFirstLogin(userId) {
        return this.checkAchievements(userId, 'LOGIN_COUNT', 1);
    }

    /**
     * Grant first title to new user
     * @param {string} userId - User ID
     */
    async grantFirstTitle(userId) {
        const newbieTitle = await Title.findOne({ where: { code: 'NEWBIE' } });
        if (!newbieTitle) return;

        const existing = await UserTitle.findOne({
            where: { user_id: userId, title_id: newbieTitle.id }
        });

        if (!existing) {
            await UserTitle.create({
                user_id: userId,
                title_id: newbieTitle.id,
                unlocked_at: new Date(),
                is_active: true // Set as default active title
            });
        }
    }
}

module.exports = new GamificationService();

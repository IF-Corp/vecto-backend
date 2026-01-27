const db = require('../models');
const { WorkSkill, WorkSkillEvidence, WorkCertification, WorkAchievement, WorkProject } = db;

// ==================== SKILLS ====================

const getSkills = async (request, reply) => {
    const { userId } = request.params;
    const { category } = request.query;

    const where = { user_id: userId };
    if (category) where.category = category;

    const skills = await WorkSkill.findAll({
        where,
        include: [{
            model: WorkSkillEvidence,
            as: 'evidences',
            order: [['evidence_date', 'DESC']],
            limit: 5,
        }],
        order: [['category', 'ASC'], ['name', 'ASC']],
    });

    // Add progress calculation to each skill
    const skillsWithProgress = skills.map(skill => {
        const progress = WorkSkill.calculateProgress(skill.current_level, skill.target_level);
        return {
            ...skill.toJSON(),
            progress,
        };
    });

    return reply.send({ data: skillsWithProgress });
};

const getSkill = async (request, reply) => {
    const { id } = request.params;

    const skill = await WorkSkill.findByPk(id, {
        include: [
            {
                model: WorkSkillEvidence,
                as: 'evidences',
                order: [['evidence_date', 'DESC']],
            },
            {
                model: WorkCertification,
                as: 'certifications',
                order: [['obtained_at', 'DESC']],
            },
        ],
    });

    if (!skill) {
        return reply.code(404).send({ error: 'Skill not found' });
    }

    const progress = WorkSkill.calculateProgress(skill.current_level, skill.target_level);

    return reply.send({
        data: {
            ...skill.toJSON(),
            progress,
        },
    });
};

const createSkill = async (request, reply) => {
    const { userId } = request.params;
    const { name, category, currentLevel, targetLevel, icon, color } = request.body;

    const skill = await WorkSkill.create({
        user_id: userId,
        name,
        category,
        current_level: currentLevel || 'BEGINNER',
        target_level: targetLevel || 'INTERMEDIATE',
        icon,
        color,
    });

    const progress = WorkSkill.calculateProgress(skill.current_level, skill.target_level);

    return reply.code(201).send({
        data: {
            ...skill.toJSON(),
            progress,
        },
    });
};

const updateSkill = async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;

    const skill = await WorkSkill.findByPk(id);

    if (!skill) {
        return reply.code(404).send({ error: 'Skill not found' });
    }

    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.currentLevel !== undefined) dbUpdates.current_level = updates.currentLevel;
    if (updates.targetLevel !== undefined) dbUpdates.target_level = updates.targetLevel;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.color !== undefined) dbUpdates.color = updates.color;

    await skill.update(dbUpdates);

    const progress = WorkSkill.calculateProgress(skill.current_level, skill.target_level);

    return reply.send({
        data: {
            ...skill.toJSON(),
            progress,
        },
    });
};

const deleteSkill = async (request, reply) => {
    const { id } = request.params;

    const skill = await WorkSkill.findByPk(id);

    if (!skill) {
        return reply.code(404).send({ error: 'Skill not found' });
    }

    await skill.destroy();

    return reply.send({ message: 'Skill deleted successfully' });
};

// ==================== SKILL EVIDENCES ====================

const addSkillEvidence = async (request, reply) => {
    const { skillId } = request.params;
    const { description, evidenceDate, url } = request.body;

    const skill = await WorkSkill.findByPk(skillId);
    if (!skill) {
        return reply.code(404).send({ error: 'Skill not found' });
    }

    const evidence = await WorkSkillEvidence.create({
        skill_id: skillId,
        description,
        evidence_date: evidenceDate,
        url,
    });

    return reply.code(201).send({ data: evidence });
};

const deleteSkillEvidence = async (request, reply) => {
    const { id } = request.params;

    const evidence = await WorkSkillEvidence.findByPk(id);

    if (!evidence) {
        return reply.code(404).send({ error: 'Evidence not found' });
    }

    await evidence.destroy();

    return reply.send({ message: 'Evidence deleted successfully' });
};

// ==================== CERTIFICATIONS ====================

const getCertifications = async (request, reply) => {
    const { userId } = request.params;
    const { expired } = request.query;

    const where = { user_id: userId };

    // Filter by expiration
    if (expired === 'true') {
        where.expires_at = { [db.Sequelize.Op.lt]: new Date() };
    } else if (expired === 'false') {
        where[db.Sequelize.Op.or] = [
            { expires_at: null },
            { expires_at: { [db.Sequelize.Op.gte]: new Date() } },
        ];
    }

    const certifications = await WorkCertification.findAll({
        where,
        include: [{
            model: WorkSkill,
            as: 'skill',
            attributes: ['id', 'name', 'category'],
        }],
        order: [['obtained_at', 'DESC']],
    });

    return reply.send({ data: certifications });
};

const getCertification = async (request, reply) => {
    const { id } = request.params;

    const certification = await WorkCertification.findByPk(id, {
        include: [{
            model: WorkSkill,
            as: 'skill',
            attributes: ['id', 'name', 'category'],
        }],
    });

    if (!certification) {
        return reply.code(404).send({ error: 'Certification not found' });
    }

    return reply.send({ data: certification });
};

const createCertification = async (request, reply) => {
    const { userId } = request.params;
    const { name, issuer, obtainedAt, expiresAt, credentialId, credentialUrl, skillId } = request.body;

    const certification = await WorkCertification.create({
        user_id: userId,
        name,
        issuer,
        obtained_at: obtainedAt,
        expires_at: expiresAt,
        credential_id: credentialId,
        credential_url: credentialUrl,
        skill_id: skillId,
    });

    return reply.code(201).send({ data: certification });
};

const updateCertification = async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;

    const certification = await WorkCertification.findByPk(id);

    if (!certification) {
        return reply.code(404).send({ error: 'Certification not found' });
    }

    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.issuer !== undefined) dbUpdates.issuer = updates.issuer;
    if (updates.obtainedAt !== undefined) dbUpdates.obtained_at = updates.obtainedAt;
    if (updates.expiresAt !== undefined) dbUpdates.expires_at = updates.expiresAt;
    if (updates.credentialId !== undefined) dbUpdates.credential_id = updates.credentialId;
    if (updates.credentialUrl !== undefined) dbUpdates.credential_url = updates.credentialUrl;
    if (updates.skillId !== undefined) dbUpdates.skill_id = updates.skillId;

    await certification.update(dbUpdates);

    return reply.send({ data: certification });
};

const deleteCertification = async (request, reply) => {
    const { id } = request.params;

    const certification = await WorkCertification.findByPk(id);

    if (!certification) {
        return reply.code(404).send({ error: 'Certification not found' });
    }

    await certification.destroy();

    return reply.send({ message: 'Certification deleted successfully' });
};

// ==================== ACHIEVEMENTS ====================

const getAchievements = async (request, reply) => {
    const { userId } = request.params;

    const achievements = await WorkAchievement.findAll({
        where: { user_id: userId },
        include: [{
            model: WorkProject,
            as: 'project',
            attributes: ['id', 'name', 'color'],
        }],
        order: [['achievement_date', 'DESC']],
    });

    return reply.send({ data: achievements });
};

const getAchievement = async (request, reply) => {
    const { id } = request.params;

    const achievement = await WorkAchievement.findByPk(id, {
        include: [{
            model: WorkProject,
            as: 'project',
            attributes: ['id', 'name', 'color'],
        }],
    });

    if (!achievement) {
        return reply.code(404).send({ error: 'Achievement not found' });
    }

    return reply.send({ data: achievement });
};

const createAchievement = async (request, reply) => {
    const { userId } = request.params;
    const { title, description, projectId, achievementDate, icon } = request.body;

    const achievement = await WorkAchievement.create({
        user_id: userId,
        title,
        description,
        project_id: projectId,
        achievement_date: achievementDate,
        icon: icon || 'Trophy',
    });

    return reply.code(201).send({ data: achievement });
};

const updateAchievement = async (request, reply) => {
    const { id } = request.params;
    const updates = request.body;

    const achievement = await WorkAchievement.findByPk(id);

    if (!achievement) {
        return reply.code(404).send({ error: 'Achievement not found' });
    }

    const dbUpdates = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.projectId !== undefined) dbUpdates.project_id = updates.projectId;
    if (updates.achievementDate !== undefined) dbUpdates.achievement_date = updates.achievementDate;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;

    await achievement.update(dbUpdates);

    return reply.send({ data: achievement });
};

const deleteAchievement = async (request, reply) => {
    const { id } = request.params;

    const achievement = await WorkAchievement.findByPk(id);

    if (!achievement) {
        return reply.code(404).send({ error: 'Achievement not found' });
    }

    await achievement.destroy();

    return reply.send({ message: 'Achievement deleted successfully' });
};

// ==================== CAREER TIMELINE ====================

const getCareerTimeline = async (request, reply) => {
    const { userId } = request.params;

    // Get achievements
    const achievements = await WorkAchievement.findAll({
        where: { user_id: userId },
        include: [{
            model: WorkProject,
            as: 'project',
            attributes: ['id', 'name', 'color'],
        }],
    });

    // Get certifications
    const certifications = await WorkCertification.findAll({
        where: { user_id: userId },
        include: [{
            model: WorkSkill,
            as: 'skill',
            attributes: ['id', 'name'],
        }],
    });

    // Combine and sort by date
    const timeline = [
        ...achievements.map(a => ({
            type: 'achievement',
            date: a.achievement_date,
            data: a,
        })),
        ...certifications.map(c => ({
            type: 'certification',
            date: c.obtained_at,
            data: c,
        })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    return reply.send({ data: timeline });
};

module.exports = {
    // Skills
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    addSkillEvidence,
    deleteSkillEvidence,
    // Certifications
    getCertifications,
    getCertification,
    createCertification,
    updateCertification,
    deleteCertification,
    // Achievements
    getAchievements,
    getAchievement,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    // Timeline
    getCareerTimeline,
};

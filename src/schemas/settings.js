// Settings module schemas

const moduleTypeEnum = {
    type: 'string',
    enum: ['HABITS', 'TASKS', 'FINANCE', 'HEALTH', 'STUDIES', 'WORK', 'SOCIAL', 'HOME']
};

const toggleModuleBody = {
    type: 'object',
    properties: {
        isActive: { type: 'boolean' }
    },
    required: ['isActive'],
    additionalProperties: false
};

const updateAppearanceBody = {
    type: 'object',
    properties: {
        theme: { type: 'string', enum: ['LIGHT', 'DARK', 'SYSTEM'] },
        accentColor: { type: 'string', enum: ['BLUE', 'GREEN', 'PURPLE', 'ORANGE', 'PINK', 'TEAL', 'RED', 'YELLOW'] },
        compactMode: { type: 'boolean' },
        animationsEnabled: { type: 'boolean' },
        soundsEnabled: { type: 'boolean' },
        highContrast: { type: 'boolean' },
        fontSize: { type: 'string', enum: ['SMALL', 'MEDIUM', 'LARGE'] }
    },
    additionalProperties: false
};

const updateNotificationsBody = {
    type: 'object',
    properties: {
        emailEnabled: { type: 'boolean' },
        pushEnabled: { type: 'boolean' },
        remindersEnabled: { type: 'boolean' },
        alertsEnabled: { type: 'boolean' },
        reportsEnabled: { type: 'boolean' },
        gamificationEnabled: { type: 'boolean' },
        quietHoursEnabled: { type: 'boolean' },
        quietHoursStart: { type: 'string', pattern: '^\\d{2}:\\d{2}$', maxLength: 5 },
        quietHoursEnd: { type: 'string', pattern: '^\\d{2}:\\d{2}$', maxLength: 5 }
    },
    additionalProperties: false
};

const updatePreferencesBody = {
    type: 'object',
    properties: {
        language: { type: 'string', maxLength: 10 },
        currency: { type: 'string', maxLength: 3 },
        dateFormat: { type: 'string', maxLength: 20 },
        timeFormat: { type: 'string', enum: ['12h', '24h'] },
        weekStartsOn: { type: 'integer', minimum: 0, maximum: 6 },
        timezone: { type: 'string', maxLength: 50 }
    },
    additionalProperties: false
};

module.exports = {
    moduleTypeEnum,
    toggleModuleBody,
    updateAppearanceBody,
    updateNotificationsBody,
    updatePreferencesBody
};

const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    is_onboarded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: true
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    auth_provider: {
        type: DataTypes.ENUM('email', 'google'),
        defaultValue: 'email',
        allowNull: false
    }
}, {
    tableName: 'users',
    timestamps: true,
    underscored: true
});

User.associate = (models) => {
    // Core module
    User.hasOne(models.UserPreferences, {
        foreignKey: 'user_id',
        as: 'preferences'
    });
    User.hasOne(models.OnboardingState, {
        foreignKey: 'user_id',
        as: 'onboardingState'
    });
    User.hasMany(models.GlobalCategory, {
        foreignKey: 'user_id',
        as: 'categories'
    });
    User.hasMany(models.NotificationConfig, {
        foreignKey: 'user_id',
        as: 'notificationConfigs'
    });

    // Habits module
    User.hasMany(models.Habit, {
        foreignKey: 'user_id',
        as: 'habits'
    });
    User.hasMany(models.Routine, {
        foreignKey: 'user_id',
        as: 'routines'
    });
    User.belongsToMany(models.SocialGroup, {
        through: models.GroupMember,
        foreignKey: 'user_id',
        otherKey: 'group_id',
        as: 'socialGroups'
    });

    // Productivity module
    User.hasMany(models.Project, {
        foreignKey: 'user_id',
        as: 'projects'
    });
    User.hasMany(models.Task, {
        foreignKey: 'user_id',
        as: 'tasks'
    });

    // Finance module
    User.hasMany(models.Account, {
        foreignKey: 'user_id',
        as: 'accounts'
    });
    User.hasMany(models.RecurringExpense, {
        foreignKey: 'user_id',
        as: 'recurringExpenses'
    });
    User.hasMany(models.Budget, {
        foreignKey: 'user_id',
        as: 'budgets'
    });

    // Health module
    User.hasMany(models.MealLog, {
        foreignKey: 'user_id',
        as: 'mealLogs'
    });
    User.hasMany(models.Workout, {
        foreignKey: 'user_id',
        as: 'workouts'
    });
    User.hasMany(models.Medication, {
        foreignKey: 'user_id',
        as: 'medications'
    });
    User.hasMany(models.SleepMetric, {
        foreignKey: 'user_id',
        as: 'sleepMetrics'
    });

    // Study module
    User.hasMany(models.LibraryShelf, {
        foreignKey: 'user_id',
        as: 'libraryShelves'
    });
    User.hasMany(models.StudySession, {
        foreignKey: 'user_id',
        as: 'studySessions'
    });
    User.hasMany(models.SpacedReview, {
        foreignKey: 'user_id',
        as: 'spacedReviews'
    });
    User.hasMany(models.Note, {
        foreignKey: 'user_id',
        as: 'notes'
    });

    // Home & Social module
    User.hasMany(models.ShoppingList, {
        foreignKey: 'user_id',
        as: 'shoppingLists'
    });
    User.hasMany(models.HouseholdInventory, {
        foreignKey: 'user_id',
        as: 'householdInventory'
    });
    User.hasMany(models.HouseholdChore, {
        foreignKey: 'user_id',
        as: 'householdChores'
    });
    User.hasMany(models.Contact, {
        foreignKey: 'user_id',
        as: 'contacts'
    });
    User.hasMany(models.CalendarEvent, {
        foreignKey: 'user_id',
        as: 'calendarEvents'
    });

    // Freeze Mode module
    User.hasOne(models.FreezeModeConfig, {
        foreignKey: 'user_id',
        as: 'freezeModeConfig'
    });
};

module.exports = User;

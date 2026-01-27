const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WorkDailyStandup = sequelize.define('WorkDailyStandup', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            field: 'user_id',
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        energyLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
            field: 'energy_level',
        },
        hasBlockers: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'has_blockers',
        },
        blockerDescription: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: 'blocker_description',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        tableName: 'work_daily_standups',
        underscored: true,
        timestamps: true,
    });

    WorkDailyStandup.associate = (models) => {
        WorkDailyStandup.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
        WorkDailyStandup.hasMany(models.WorkDailyStandupTask, {
            foreignKey: 'standupId',
            as: 'tasks',
        });
    };

    return WorkDailyStandup;
};

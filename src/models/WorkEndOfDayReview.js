const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const WorkEndOfDayReview = sequelize.define('WorkEndOfDayReview', {
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
        tasksPlanned: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'tasks_planned',
        },
        tasksCompleted: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            field: 'tasks_completed',
        },
        hoursWorked: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
            field: 'hours_worked',
        },
        productivityRating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
            field: 'productivity_rating',
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        uncompletedTasksMoved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'uncompleted_tasks_moved',
        },
    }, {
        tableName: 'work_end_of_day_reviews',
        underscored: true,
        timestamps: true,
    });

    WorkEndOfDayReview.associate = (models) => {
        WorkEndOfDayReview.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    };

    // Calculate completion percentage
    WorkEndOfDayReview.prototype.getCompletionPercentage = function() {
        if (this.tasksPlanned === 0) return 100;
        return Math.round((this.tasksCompleted / this.tasksPlanned) * 100);
    };

    return WorkEndOfDayReview;
};

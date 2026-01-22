const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const SpacedReview = sequelize.define('SpacedReview', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    topic: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    ease_factor: {
        type: DataTypes.DECIMAL(4, 2),
        defaultValue: 2.5,
        allowNull: false
    },
    interval_days: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    repetitions: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    next_review_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    last_review_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    last_quality: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {
    tableName: 'spaced_reviews',
    timestamps: true,
    underscored: true
});

SpacedReview.associate = (models) => {
    SpacedReview.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = SpacedReview;

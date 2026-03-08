const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const TourState = sequelize.define(
    'TourState',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
        },
        app_tour_completed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        app_tour_current_step: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        completed_page_tours: {
            type: DataTypes.JSONB,
            defaultValue: [],
            allowNull: false,
        },
        skipped_tours: {
            type: DataTypes.JSONB,
            defaultValue: [],
            allowNull: false,
        },
    },
    {
        tableName: 'tour_state',
        timestamps: true,
        underscored: true,
    },
);

TourState.associate = (models) => {
    TourState.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};

module.exports = TourState;

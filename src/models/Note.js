const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Note = sequelize.define('Note', {
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
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
        allowNull: false
    },
    is_pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    is_archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'notes',
    timestamps: true,
    underscored: true
});

Note.associate = (models) => {
    Note.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = Note;

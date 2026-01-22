const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const LibraryShelf = sequelize.define('LibraryShelf', {
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
    author: {
        type: DataTypes.STRING,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM('BOOK', 'ARTICLE', 'COURSE', 'VIDEO', 'PODCAST', 'OTHER'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('TO_READ', 'READING', 'COMPLETED', 'ABANDONED'),
        defaultValue: 'TO_READ',
        allowNull: false
    },
    current_page: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    total_pages: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5
        }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    finish_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cover_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'library_shelves',
    timestamps: true,
    underscored: true
});

LibraryShelf.associate = (models) => {
    LibraryShelf.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = LibraryShelf;

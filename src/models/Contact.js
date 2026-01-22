const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Contact = sequelize.define('Contact', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    relationship: {
        type: DataTypes.ENUM('FAMILY', 'FRIEND', 'WORK', 'ACQUAINTANCE', 'OTHER'),
        allowNull: true
    },
    birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    company: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    photo_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_favorite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'contacts',
    timestamps: true,
    underscored: true
});

Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
    });
};

module.exports = Contact;

const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Product = sequelize.define('ProductDetails', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        allowNull: false,
    },
    productId: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    design: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'ProductDetails',
    timestamps: false
});


module.exports = Product;
'use strict';
const Sequelize = require('sequelize');
const env = 'development';
const config = require('../database/dbConnect')[env];

// Create an instance of sequelize
const sequelize = new Sequelize(config);

// Validate and connect to the database
sequelize.authenticate()
    .then(() => console.log(`Successfully connected to ${config.dialect}!`))
    .catch((error) => console.log(`Failed to connect ${config.dialect}: ${error}`));

module.exports = sequelize;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Company = sequelize.define('Company', {
  name: { type: DataTypes.STRING(100), allowNull: false },
  logo: { type: DataTypes.STRING(255) },
  intro: { type: DataTypes.TEXT },
  scale: { type: DataTypes.STRING(50) },
}, { tableName: 'companies' });

module.exports = Company;
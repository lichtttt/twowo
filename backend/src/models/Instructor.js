const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Instructor = sequelize.define('Instructor', {
  name: { type: DataTypes.STRING(50), allowNull: false },
  avatar: { type: DataTypes.STRING(255) },
  title: { type: DataTypes.STRING(50) },
  intro: { type: DataTypes.TEXT },
  userId: { type: DataTypes.INTEGER, field: 'user_id' },
}, { tableName: 'instructors' });

module.exports = Instructor;
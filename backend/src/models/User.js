const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  email: { type: DataTypes.STRING(100) },
  phone: { type: DataTypes.STRING(20) },
  nickname: { type: DataTypes.STRING(50) },
  avatar: { type: DataTypes.STRING(255) },
  major: { type: DataTypes.STRING(100) },
  role: { type: DataTypes.ENUM('student', 'teacher', 'admin'), defaultValue: 'student' },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at' },
}, { tableName: 'users' });

module.exports = User;
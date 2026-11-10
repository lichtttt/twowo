const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  type: { type: DataTypes.ENUM('course_update', 'plan_expire', 'system'), defaultValue: 'system' },
  title: { type: DataTypes.STRING(200) },
  content: { type: DataTypes.TEXT },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_read' },
}, { tableName: 'notifications' });

module.exports = Notification;
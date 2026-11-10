const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  courseId: { type: DataTypes.INTEGER, field: 'course_id' },
  title: { type: DataTypes.STRING(200), allowNull: false },
  code: { type: DataTypes.TEXT },
  score: { type: DataTypes.DECIMAL(5, 2) },
  feedback: { type: DataTypes.TEXT },
}, { tableName: 'assignments' });

module.exports = Assignment;
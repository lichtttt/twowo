const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  cover: { type: DataTypes.STRING(255) },
  techSystem: { type: DataTypes.ENUM('theory', 'practice', 'cert'), defaultValue: 'theory', field: 'tech_system' },
  techDirection: { type: DataTypes.ENUM('ai', 'bigdata', 'cloud', 'web', 'mobile', 'other'), defaultValue: 'other', field: 'tech_direction' },
  difficulty: { type: DataTypes.TINYINT, defaultValue: 1 },
  isFree: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_free' },
  price: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  instructorId: { type: DataTypes.INTEGER, field: 'instructor_id' },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
  studentCount: { type: DataTypes.INTEGER, defaultValue: 0, field: 'student_count' },
  ratingAvg: { type: DataTypes.DECIMAL(3, 1), defaultValue: 0, field: 'rating_avg' },
  publishedAt: { type: DataTypes.DATE, field: 'published_at' },
}, { tableName: 'courses' });

module.exports = Course;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseRating = sequelize.define('CourseRating', {
  courseId: { type: DataTypes.INTEGER, allowNull: false, field: 'course_id' },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  rating: { type: DataTypes.TINYINT, allowNull: false },
  comment: { type: DataTypes.TEXT },
  reply: { type: DataTypes.TEXT },
}, { tableName: 'course_ratings' });

module.exports = CourseRating;
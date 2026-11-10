const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserCourse = sequelize.define('UserCourse', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  courseId: { type: DataTypes.INTEGER, allowNull: false, field: 'course_id' },
  isFavorited: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_favorited' },
  isLearning: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_learning' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 },
  lastChapterId: { type: DataTypes.INTEGER, field: 'last_chapter_id' },
}, { tableName: 'user_courses' });

module.exports = UserCourse;
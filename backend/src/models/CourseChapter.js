const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CourseChapter = sequelize.define('CourseChapter', {
  courseId: { type: DataTypes.INTEGER, allowNull: false, field: 'course_id' },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT },
  videoUrl: { type: DataTypes.STRING(255), field: 'video_url' },
  sort: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'course_chapters' });

module.exports = CourseChapter;
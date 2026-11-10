const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CommunityPost = sequelize.define('CommunityPost', {
  courseId: { type: DataTypes.INTEGER, field: 'course_id' },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  type: { type: DataTypes.ENUM('discuss', 'qa'), defaultValue: 'discuss' },
  title: { type: DataTypes.STRING(200) },
  content: { type: DataTypes.TEXT, allowNull: false },
  parentId: { type: DataTypes.INTEGER, field: 'parent_id' },
}, { tableName: 'community_posts' });

module.exports = CommunityPost;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AiConversation = sequelize.define('AiConversation', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  courseId: { type: DataTypes.INTEGER, field: 'course_id' },
  title: { type: DataTypes.STRING(200), defaultValue: '新会话' },
}, { tableName: 'ai_conversations' });

module.exports = AiConversation;
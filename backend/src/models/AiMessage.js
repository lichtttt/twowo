const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AiMessage = sequelize.define('AiMessage', {
  conversationId: { type: DataTypes.INTEGER, allowNull: false, field: 'conversation_id' },
  role: { type: DataTypes.ENUM('user', 'assistant'), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
}, { tableName: 'ai_messages' });

module.exports = AiMessage;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningPlan = sequelize.define('LearningPlan', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  planJson: { type: DataTypes.TEXT, field: 'plan_json' },
  expireAt: { type: DataTypes.DATE, field: 'expire_at' },
}, { tableName: 'learning_plans' });

module.exports = LearningPlan;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserJob = sequelize.define('UserJob', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  jobId: { type: DataTypes.INTEGER, allowNull: false, field: 'job_id' },
  isFavorited: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_favorited' },
}, { tableName: 'user_jobs' });

module.exports = UserJob;
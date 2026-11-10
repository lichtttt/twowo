const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  jobId: { type: DataTypes.INTEGER, allowNull: false, field: 'job_id' },
  status: { type: DataTypes.ENUM('applied', 'interview', 'offer', 'rejected'), defaultValue: 'applied' },
  resume: { type: DataTypes.TEXT },
  aiInterviewScore: { type: DataTypes.DECIMAL(5, 2), field: 'ai_interview_score' },
  aiInterviewFeedback: { type: DataTypes.TEXT, field: 'ai_interview_feedback' },
}, { tableName: 'job_applications' });

module.exports = JobApplication;
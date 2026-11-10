const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
  title: { type: DataTypes.STRING(200), allowNull: false },
  companyId: { type: DataTypes.INTEGER, allowNull: false, field: 'company_id' },
  category: { type: DataTypes.STRING(50) },
  salaryMin: { type: DataTypes.INTEGER, field: 'salary_min' },
  salaryMax: { type: DataTypes.INTEGER, field: 'salary_max' },
  city: { type: DataTypes.STRING(50) },
  description: { type: DataTypes.TEXT },
  requirements: { type: DataTypes.TEXT },
  status: { type: DataTypes.TINYINT, defaultValue: 1 },
}, { tableName: 'jobs' });

module.exports = Job;
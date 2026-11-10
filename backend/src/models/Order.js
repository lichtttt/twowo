const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  orderNo: { type: DataTypes.STRING(50), allowNull: false, unique: true, field: 'order_no' },
  userId: { type: DataTypes.INTEGER, allowNull: false, field: 'user_id' },
  courseId: { type: DataTypes.INTEGER, allowNull: false, field: 'course_id' },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'paid', 'cancelled', 'refunded'), defaultValue: 'pending' },
  payType: { type: DataTypes.STRING(20), field: 'pay_type' },
}, { tableName: 'orders' });

module.exports = Order;
const bcrypt = require('bcryptjs');
const { User, UserCourse, Course, Order, UserJob, Job } = require('../models');
const { success, fail } = require('../utils/response');

exports.updateProfile = async (req, res, next) => {
  try {
    const { nickname, avatar, major, email, phone } = req.body;
    await req.user.update({ nickname, avatar, major, email, phone });
    res.json(success(null, '修改成功'));
  } catch (e) { next(e); }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const ok = await bcrypt.compare(oldPassword, req.user.password);
    if (!ok) return res.json(fail('原密码错误'));
    const hash = await bcrypt.hash(newPassword, 10);
    await req.user.update({ password: hash });
    res.json(success(null, '修改成功'));
  } catch (e) { next(e); }
};

exports.myCourses = async (req, res, next) => {
  try {
    const list = await UserCourse.findAll({
      where: { userId: req.user.id, isLearning: true },
      include: [Course],
    });
    res.json(success(list));
  } catch (e) { next(e); }
};

exports.myFavorites = async (req, res, next) => {
  try {
    const courses = await UserCourse.findAll({
      where: { userId: req.user.id, isFavorited: true },
      include: [Course],
    });
    const jobs = await UserJob.findAll({
      where: { userId: req.user.id, isFavorited: true },
      include: [Job],
    });
    res.json(success({ courses, jobs }));
  } catch (e) { next(e); }
};

exports.myOrders = async (req, res, next) => {
  try {
    const list = await Order.findAll({
      where: { userId: req.user.id },
      include: [Course],
      order: [['created_at', 'DESC']],
    });
    res.json(success(list));
  } catch (e) { next(e); }
};
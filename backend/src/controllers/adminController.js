const { Op } = require('sequelize');
const { User, Course, Job, Order, JobApplication, Instructor, Company } = require('../models');
const { success, fail } = require('../utils/response');

exports.users = async (req, res, next) => {
  try {
    const { keyword, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (keyword) where[Op.or] = [{ username: { [Op.like]: `%${keyword}%` } }, { nickname: { [Op.like]: `%${keyword}%` } }];
    const { rows, count } = await User.findAndCountAll({
      where, attributes: { exclude: ['password'] },
      limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize), order: [['created_at', 'DESC']],
    });
    res.json(success({ list: rows, total: count }));
  } catch (e) { next(e); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.json(fail('用户不存在'));
    const { role, status, nickname, major } = req.body;
    await user.update({ role, status, nickname, major });
    res.json(success(null, '更新成功'));
  } catch (e) { next(e); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json(success(null, '已删除'));
  } catch (e) { next(e); }
};

exports.orders = async (req, res, next) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    const { rows, count } = await Order.findAndCountAll({
      where, include: [User, Course],
      limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize), order: [['created_at', 'DESC']],
    });
    res.json(success({ list: rows, total: count }));
  } catch (e) { next(e); }
};

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.json(fail('订单不存在'));
    await order.update(req.body);
    res.json(success(null, '更新成功'));
  } catch (e) { next(e); }
};

exports.courses = async (req, res, next) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (status !== undefined && status !== '') where.status = Number(status);
    const { rows, count } = await Course.findAndCountAll({
      where, include: [{ model: Instructor, as: 'instructor' }],
      limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize), order: [['created_at', 'DESC']],
    });
    res.json(success({ list: rows, total: count }));
  } catch (e) { next(e); }
};

exports.setCourseStatus = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.json(fail('课程不存在'));
    const { status } = req.body;
    await course.update({ status, publishedAt: status === 1 ? new Date() : course.publishedAt });
    res.json(success(null, status === 1 ? '已上架' : '已下架'));
  } catch (e) { next(e); }
};

exports.saveCourse = async (req, res, next) => {
  try {
    const data = req.body;
    if (data.id) {
      await Course.update(data, { where: { id: data.id } });
      res.json(success(null, '更新成功'));
    } else {
      await Course.create({ ...data, publishedAt: new Date() });
      res.json(success(null, '创建成功'));
    }
  } catch (e) { next(e); }
};

exports.jobs = async (req, res, next) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (status !== undefined && status !== '') where.status = Number(status);
    const { rows, count } = await Job.findAndCountAll({
      where, include: [{ model: Company, as: 'company' }],
      limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize), order: [['created_at', 'DESC']],
    });
    res.json(success({ list: rows, total: count }));
  } catch (e) { next(e); }
};

exports.setJobStatus = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.json(fail('职位不存在'));
    await job.update({ status: req.body.status });
    res.json(success(null, '更新成功'));
  } catch (e) { next(e); }
};

exports.saveJob = async (req, res, next) => {
  try {
    const data = req.body;
    if (data.id) { await Job.update(data, { where: { id: data.id } }); res.json(success(null, '更新成功')); }
    else { await Job.create(data); res.json(success(null, '创建成功')); }
  } catch (e) { next(e); }
};

exports.applications = async (req, res, next) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    const { rows, count } = await JobApplication.findAndCountAll({
      where, include: [User, Job],
      limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize), order: [['created_at', 'DESC']],
    });
    res.json(success({ list: rows, total: count }));
  } catch (e) { next(e); }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const app = await JobApplication.findByPk(req.params.id);
    if (!app) return res.json(fail('申请不存在'));
    await app.update(req.body);
    res.json(success(null, '更新成功'));
  } catch (e) { next(e); }
};

exports.instructors = async (req, res, next) => {
  try {
    const list = await Instructor.findAll();
    res.json(success(list));
  } catch (e) { next(e); }
};

exports.saveInstructor = async (req, res, next) => {
  try {
    const data = req.body;
    if (data.id) { await Instructor.update(data, { where: { id: data.id } }); }
    else { await Instructor.create(data); }
    res.json(success(null, '保存成功'));
  } catch (e) { next(e); }
};

exports.companies = async (req, res, next) => {
  try {
    const list = await Company.findAll();
    res.json(success(list));
  } catch (e) { next(e); }
};

exports.saveCompany = async (req, res, next) => {
  try {
    const data = req.body;
    if (data.id) { await Company.update(data, { where: { id: data.id } }); }
    else { await Company.create(data); }
    res.json(success(null, '保存成功'));
  } catch (e) { next(e); }
};
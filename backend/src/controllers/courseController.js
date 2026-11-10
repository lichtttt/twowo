const { Op } = require('sequelize');
const { Course, CourseChapter, CourseRating, UserCourse, User, Instructor, Order, Notification } = require('../models');
const { success, fail } = require('../utils/response');

exports.list = async (req, res, next) => {
  try {
    const { techSystem, techDirection, difficulty, isFree, sort, keyword, page = 1, pageSize = 12 } = req.query;
    const where = { status: 1 };
    if (techSystem) where.techSystem = techSystem;
    if (techDirection) where.techDirection = techDirection;
    if (difficulty) where.difficulty = Number(difficulty);
    if (isFree !== undefined && isFree !== '') where.isFree = isFree === 'true' || isFree === '1';
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { '$instructor.name$': { [Op.like]: `%${keyword}%` } },
      ];
    }
    let order = [['published_at', 'DESC']];
    if (sort === 'students') order = [['studentCount', 'DESC']];
    else if (sort === 'rating') order = [['ratingAvg', 'DESC']];
    const { rows, count } = await Course.findAndCountAll({
      where, include: [{ model: Instructor, as: 'instructor' }],
      order, limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize),
    });
    res.json(success({ list: rows, total: count, page: Number(page), pageSize: Number(pageSize) }));
  } catch (e) { next(e); }
};

exports.detail = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [
        { model: Instructor, as: 'instructor' },
        { model: CourseChapter, order: [['sort', 'ASC']] },
      ],
    });
    if (!course) return res.json(fail('课程不存在'));
    const ratings = await CourseRating.findAll({
      where: { courseId: course.id }, include: [{ model: User, as: 'user' }], limit: 20,
    });
    let userState = null;
    if (req.user) {
      userState = await UserCourse.findOne({ where: { userId: req.user.id, courseId: course.id } });
    }
    res.json(success({ course, ratings, userState }));
  } catch (e) { next(e); }
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);
    let uc = await UserCourse.findOne({ where: { userId: req.user.id, courseId } });
    if (uc) {
      await uc.update({ isFavorited: !uc.isFavorited });
    } else {
      uc = await UserCourse.create({ userId: req.user.id, courseId, isFavorited: true });
    }
    res.json(success({ isFavorited: uc.isFavorited }));
  } catch (e) { next(e); }
};

exports.startLearning = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);
    const course = await Course.findByPk(courseId);
    if (!course) return res.json(fail('课程不存在'));
    let uc = await UserCourse.findOne({ where: { userId: req.user.id, courseId } });
    if (uc) {
      await uc.update({ isLearning: true });
    } else {
      uc = await UserCourse.create({ userId: req.user.id, courseId, isLearning: true });
    }
    if (!course.isFree) {
      const existOrder = await Order.findOne({ where: { userId: req.user.id, courseId, status: 'paid' } });
      if (!existOrder) {
        await Order.create({
          orderNo: `ORD${Date.now()}${req.user.id}`, userId: req.user.id, courseId,
          amount: course.price, status: 'pending',
        });
      }
    }
    await course.update({ studentCount: course.studentCount + 1 });
    res.json(success(null, '已开始学习'));
  } catch (e) { next(e); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);
    const { progress, lastChapterId } = req.body;
    let uc = await UserCourse.findOne({ where: { userId: req.user.id, courseId } });
    if (!uc) return res.json(fail('未开始学习该课程'));
    await uc.update({ progress, lastChapterId });
    res.json(success(null, '进度已更新'));
  } catch (e) { next(e); }
};

exports.ratings = async (req, res, next) => {
  try {
    const list = await CourseRating.findAll({
      where: { courseId: req.params.id }, include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']],
    });
    res.json(success(list));
  } catch (e) { next(e); }
};

exports.addRating = async (req, res, next) => {
  try {
    const courseId = Number(req.params.id);
    const { rating, comment } = req.body;
    const r = await CourseRating.create({ courseId, userId: req.user.id, rating, comment });
    const all = await CourseRating.findAll({ where: { courseId } });
    const avg = (all.reduce((s, x) => s + x.rating, 0) / all.length).toFixed(1);
    await Course.update({ ratingAvg: avg }, { where: { id: courseId } });
    res.json(success(r, '评价成功'));
  } catch (e) { next(e); }
};
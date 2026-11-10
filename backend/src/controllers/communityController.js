const { CommunityPost, User, Course } = require('../models');
const { success, fail } = require('../utils/response');

exports.list = async (req, res, next) => {
  try {
    const { courseId, type, page = 1, pageSize = 20 } = req.query;
    const where = { parentId: null };
    if (courseId) where.courseId = courseId;
    if (type) where.type = type;
    const { rows, count } = await CommunityPost.findAndCountAll({
      where, include: [{ model: User, as: 'user' }],
      order: [['created_at', 'DESC']],
      limit: Number(pageSize), offset: (Number(page) - 1) * Number(pageSize),
    });
    res.json(success({ list: rows, total: count }));
  } catch (e) { next(e); }
};

exports.detail = async (req, res, next) => {
  try {
    const post = await CommunityPost.findByPk(req.params.id, { include: [{ model: User, as: 'user' }] });
    if (!post) return res.json(fail('帖子不存在'));
    const replies = await CommunityPost.findAll({ where: { parentId: post.id }, include: [{ model: User, as: 'user' }] });
    res.json(success({ post, replies }));
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { courseId, type, title, content, parentId } = req.body;
    const post = await CommunityPost.create({ courseId, type: type || 'discuss', title, content, parentId, userId: req.user.id });
    res.json(success(post, '发布成功'));
  } catch (e) { next(e); }
};
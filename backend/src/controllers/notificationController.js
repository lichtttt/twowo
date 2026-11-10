const { Notification } = require('../models');
const { success, fail } = require('../utils/response');

exports.list = async (req, res, next) => {
  try {
    const list = await Notification.findAll({
      where: { userId: req.user.id }, order: [['created_at', 'DESC']],
    });
    res.json(success(list));
  } catch (e) { next(e); }
};

exports.markRead = async (req, res, next) => {
  try {
    await Notification.update({ isRead: true }, { where: { id: req.params.id, userId: req.user.id } });
    res.json(success(null, '已标记已读'));
  } catch (e) { next(e); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.update({ isRead: true }, { where: { userId: req.user.id, isRead: false } });
    res.json(success(null, '全部已读'));
  } catch (e) { next(e); }
};
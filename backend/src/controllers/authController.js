const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { sign } = require('../utils/jwt');
const { success, fail } = require('../utils/response');

exports.register = async (req, res, next) => {
  try {
    const { username, password, email, phone, nickname, major, role } = req.body;
    if (!username || !password) return res.json(fail('用户名和密码必填'));
    const exist = await User.findOne({ where: { username } });
    if (exist) return res.json(fail('用户名已存在'));
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username, password: hash, email, phone,
      nickname: nickname || username, major,
      role: role || 'student',
    });
    const token = sign({ id: user.id, role: user.role });
    res.json(success({ token, user: sanitize(user) }, '注册成功'));
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.json(fail('用户不存在'));
    if (user.status !== 1) return res.json(fail('账号已禁用'));
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.json(fail('密码错误'));
    await user.update({ lastLoginAt: new Date() });
    const token = sign({ id: user.id, role: user.role });
    res.json(success({ token, user: sanitize(user) }, '登录成功'));
  } catch (e) { next(e); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { username, email, newPassword } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.json(fail('用户不存在'));
    if (email && user.email !== email) return res.json(fail('邮箱不匹配'));
    const hash = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hash });
    res.json(success(null, '密码重置成功'));
  } catch (e) { next(e); }
};

exports.me = async (req, res) => {
  res.json(success(sanitize(req.user)));
};

function sanitize(u) {
  return { id: u.id, username: u.username, email: u.email, phone: u.phone, nickname: u.nickname, avatar: u.avatar, major: u.major, role: u.role };
}
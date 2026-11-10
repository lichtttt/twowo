const { User } = require('../models');
const { verify } = require('../utils/jwt');
const { fail } = require('../utils/response');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json(fail('未登录', 401));
    const payload = verify(token);
    const user = await User.findByPk(payload.id);
    if (!user || user.status !== 1) return res.status(401).json(fail('用户无效', 401));
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json(fail('登录已过期', 401));
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json(fail('无权限', 403));
    }
    next();
  };
}

module.exports = { auth, requireRole };
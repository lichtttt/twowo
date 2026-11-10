const { fail } = require('../utils/response');

function notFound(req, res) {
  res.status(404).json(fail('接口不存在', 404));
}

function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err.message || err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json(fail(err.message || '服务器内部错误', status));
}

module.exports = { notFound, errorHandler };
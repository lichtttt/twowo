const jwt = require('jsonwebtoken');
const config = require('../config');

function sign(payload) {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expires });
}
function verify(token) {
  return jwt.verify(token, config.jwt.secret);
}
module.exports = { sign, verify };
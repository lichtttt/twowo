const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/user', require('./user'));
router.use('/course', require('./course'));
router.use('/job', require('./job'));
router.use('/ai', require('./ai'));
router.use('/community', require('./community'));
router.use('/notification', require('./notification'));
router.use('/admin', require('./admin'));

module.exports = router;
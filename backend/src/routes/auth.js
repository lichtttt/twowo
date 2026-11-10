const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { auth: authMw } = require('../middlewares/auth');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/reset-password', auth.resetPassword);
router.get('/me', authMw, auth.me);

module.exports = router;
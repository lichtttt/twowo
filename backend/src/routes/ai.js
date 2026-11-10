const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/aiController');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.post('/chat', ctrl.chat);
router.get('/conversations', ctrl.conversations);
router.get('/conversations/:id', ctrl.conversationDetail);
router.post('/learning-path', ctrl.learningPath);
router.post('/grade', ctrl.grade);
router.get('/report', ctrl.report);

module.exports = router;
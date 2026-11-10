const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/notificationController');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.get('/', ctrl.list);
router.put('/:id/read', ctrl.markRead);
router.put('/all/read', ctrl.markAllRead);

module.exports = router;
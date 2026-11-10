const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/jobController');
const { auth } = require('../middlewares/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.detail);
router.post('/:id/favorite', auth, ctrl.toggleFavorite);
router.post('/:id/apply', auth, ctrl.apply);
router.post('/:id/ai-interview', auth, ctrl.aiInterview);

module.exports = router;
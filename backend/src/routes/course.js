const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/courseController');
const { auth } = require('../middlewares/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.detail);
router.post('/:id/favorite', auth, ctrl.toggleFavorite);
router.post('/:id/learn', auth, ctrl.startLearning);
router.put('/:id/progress', auth, ctrl.updateProgress);
router.get('/:id/ratings', ctrl.ratings);
router.post('/:id/ratings', auth, ctrl.addRating);

module.exports = router;
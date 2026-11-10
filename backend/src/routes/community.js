const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/communityController');
const { auth } = require('../middlewares/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.detail);
router.post('/', auth, ctrl.create);

module.exports = router;
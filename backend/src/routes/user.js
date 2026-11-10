const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

router.use(auth);
router.put('/profile', ctrl.updateProfile);
router.put('/password', ctrl.updatePassword);
router.get('/courses', ctrl.myCourses);
router.get('/favorites', ctrl.myFavorites);
router.get('/orders', ctrl.myOrders);

module.exports = router;
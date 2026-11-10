const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { auth, requireRole } = require('../middlewares/auth');

router.use(auth, requireRole('admin'));

router.get('/users', ctrl.users);
router.put('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

router.get('/orders', ctrl.orders);
router.put('/orders/:id', ctrl.updateOrder);

router.get('/courses', ctrl.courses);
router.put('/courses/:id/status', ctrl.setCourseStatus);
router.post('/courses', ctrl.saveCourse);
router.put('/courses/:id', ctrl.saveCourse);

router.get('/jobs', ctrl.jobs);
router.put('/jobs/:id/status', ctrl.setJobStatus);
router.post('/jobs', ctrl.saveJob);
router.put('/jobs/:id', ctrl.saveJob);

router.get('/applications', ctrl.applications);
router.put('/applications/:id', ctrl.updateApplication);

router.get('/instructors', ctrl.instructors);
router.post('/instructors', ctrl.saveInstructor);
router.put('/instructors/:id', ctrl.saveInstructor);

router.get('/companies', ctrl.companies);
router.post('/companies', ctrl.saveCompany);
router.put('/companies/:id', ctrl.saveCompany);

module.exports = router;
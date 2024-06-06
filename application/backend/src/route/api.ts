import express from 'express';
const router = express.Router();

import user from './user.route';
import resource from './resource.route';
import student from './student.route';
import professor from './professor.route';
import auth from './auth.route';

router.use('/v1/users', user);
router.use('/v1/resources', resource);
router.use('/v1/students', student);
router.use('/v1/professors', professor);

router.use('/v1/auth', auth);

export default router;

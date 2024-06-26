import express from 'express';
const router = express.Router();

import user from './user.route';
import resource from './resource.route';
import student from './student.route';
import professor from './professor.route';
import department from './department.route';
import taxonomy from './taxonomy.route';
import university_period from './university_period.route';
import email from './notification/email.route';

router.use('/v1/check', (_, res) => {
    res.json('Server is running');
})


router.use('/v1/users', user);
router.use('/v1/students', student); 
router.use('/v1/professors', professor);
router.use('/v1/departments', department);
router.use('/v1/taxonomies', taxonomy);
router.use('/v1/university_periods', university_period);
router.use('/v1/resources', resource);


router.use('/v1/notification', email);
export default router;

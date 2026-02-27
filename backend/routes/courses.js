import express from 'express';
import {
    createCourse,
    getCourses,
    deleteCourse,
    updateCourse,
} from '../controllers/courseController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/', protect, createCourse);
router.delete('/:id', protect, deleteCourse);
router.put('/:id', protect, updateCourse);

export default router;

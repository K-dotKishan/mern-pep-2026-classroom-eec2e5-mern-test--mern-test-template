import Course from '../models/Course.js';

// POST /api/courses
export const createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, instructor } = req.body;

        if (!courseName || !courseDescription || !instructor) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const course = await Course.create({ courseName, courseDescription, instructor });
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// GET /api/courses
export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.deleteOne();
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// PUT /api/courses/:id  (Edit course — advanced feature)
export const updateCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, instructor } = req.body;
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            { courseName, courseDescription, instructor },
            { new: true, runValidators: true }
        );
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

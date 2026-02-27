import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: [true, 'Course name is required'],
            trim: true,
        },
        courseDescription: {
            type: String,
            required: [true, 'Course description is required'],
            trim: true,
        },
        instructor: {
            type: String,
            required: [true, 'Instructor name is required'],
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: false }
);

export default mongoose.model('Course', courseSchema);

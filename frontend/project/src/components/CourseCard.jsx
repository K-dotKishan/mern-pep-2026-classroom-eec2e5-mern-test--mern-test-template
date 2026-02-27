export default function CourseCard({ course, onDelete, onEdit }) {
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="course-card">
            <div className="course-card-header">
                <h3 className="course-name">{course.courseName}</h3>
            </div>
            <p className="course-description">{course.courseDescription}</p>
            <div className="course-footer">
                <div className="course-meta">
                    <span className="course-badge badge-instructor">
                        👤 {course.instructor}
                    </span>
                    <span className="badge-date">
                        📅 {formatDate(course.createdAt)}
                    </span>
                </div>
                <div className="course-actions">
                    <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => onEdit(course)}
                        title="Edit course"
                    >
                        ✏️ Edit
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(course._id)}
                        title="Delete course"
                    >
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

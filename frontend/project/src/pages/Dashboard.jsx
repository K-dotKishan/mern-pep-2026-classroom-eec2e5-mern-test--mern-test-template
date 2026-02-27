import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import CourseCard from '../components/CourseCard';

const EMPTY_FORM = { courseName: '', courseDescription: '', instructor: '' };

export default function Dashboard() {
    const { token } = useAuth();
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [formSuccess, setFormSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    // Search + Filter state
    const [search, setSearch] = useState('');
    const [filterInstructor, setFilterInstructor] = useState('');

    // Edit modal state
    const [editCourse, setEditCourse] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_FORM);
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');

    const headers = { Authorization: `Bearer ${token}` };

    // Fetch courses
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/courses');
            setCourses(data);
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    // Create course
    const handleCreate = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        const { courseName, courseDescription, instructor } = form;
        if (!courseName || !courseDescription || !instructor) {
            return setFormError('All fields are required');
        }
        try {
            setFormLoading(true);
            const { data } = await axios.post('/api/courses', form, { headers });
            setCourses([data, ...courses]);
            setForm(EMPTY_FORM);
            setFormSuccess('Course created successfully! 🎉');
            setTimeout(() => setFormSuccess(''), 3000);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setFormLoading(false);
        }
    };

    // Delete course
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await axios.delete(`/api/courses/${id}`, { headers });
            setCourses(courses.filter((c) => c._id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete course');
        }
    };

    // Open edit modal
    const handleEditOpen = (course) => {
        setEditCourse(course);
        setEditForm({
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            instructor: course.instructor,
        });
        setEditError('');
    };

    // Save edit
    const handleEditSave = async (e) => {
        e.preventDefault();
        if (!editForm.courseName || !editForm.courseDescription || !editForm.instructor) {
            return setEditError('All fields are required');
        }
        try {
            setEditLoading(true);
            const { data } = await axios.put(`/api/courses/${editCourse._id}`, editForm, { headers });
            setCourses(courses.map((c) => (c._id === data._id ? data : c)));
            setEditCourse(null);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update course');
        } finally {
            setEditLoading(false);
        }
    };

    // Unique instructors for filter dropdown
    const instructors = useMemo(() => {
        const set = new Set(courses.map((c) => c.instructor));
        return [...set].sort();
    }, [courses]);

    // Filtered courses (search + instructor filter)
    const filteredCourses = useMemo(() => {
        const term = search.toLowerCase().trim();
        return courses.filter((c) => {
            const matchSearch =
                !term ||
                c.courseName.toLowerCase().includes(term) ||
                c.instructor.toLowerCase().includes(term) ||
                c.courseDescription.toLowerCase().includes(term);
            const matchInstructor = !filterInstructor || c.instructor === filterInstructor;
            return matchSearch && matchInstructor;
        });
    }, [courses, search, filterInstructor]);

    return (
        <div className="dashboard-page">
            {/* Header */}
            <div className="dashboard-header">
                <h1 className="dashboard-title">📚 Course Dashboard</h1>
                <p className="dashboard-subtitle">Manage and explore all available courses</p>
            </div>

            {/* Stats */}
            <div className="stats-row">
                <div className="stat-card">
                    <div className="stat-value">{courses.length}</div>
                    <div className="stat-label">Total Courses</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{instructors.length}</div>
                    <div className="stat-label">Instructors</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{filteredCourses.length}</div>
                    <div className="stat-label">Showing</div>
                </div>
            </div>

            <div className="dashboard-grid">
                {/* ── Create Course Form ── */}
                <div className="panel">
                    <h2 className="panel-title">
                        <span className="icon">✏️</span> Create New Course
                    </h2>

                    {formError && <div className="alert alert-error">⚠️ {formError}</div>}
                    {formSuccess && <div className="alert alert-success">✅ {formSuccess}</div>}

                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label className="form-label">Course Name</label>
                            <input
                                id="course-name"
                                className="form-input"
                                type="text"
                                placeholder="e.g. Introduction to React"
                                value={form.courseName}
                                onChange={(e) => { setForm({ ...form, courseName: e.target.value }); setFormError(''); }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                id="course-description"
                                className="form-input"
                                placeholder="Brief overview of the course..."
                                value={form.courseDescription}
                                onChange={(e) => { setForm({ ...form, courseDescription: e.target.value }); setFormError(''); }}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Instructor Name</label>
                            <input
                                id="course-instructor"
                                className="form-input"
                                type="text"
                                placeholder="e.g. Dr. Smith"
                                value={form.instructor}
                                onChange={(e) => { setForm({ ...form, instructor: e.target.value }); setFormError(''); }}
                            />
                        </div>
                        <button
                            id="create-course-btn"
                            className="btn btn-primary btn-block"
                            type="submit"
                            disabled={formLoading}
                        >
                            {formLoading ? '⏳ Creating...' : '➕ Create Course'}
                        </button>
                    </form>
                </div>

                {/* ── Course List ── */}
                <div>
                    <div className="panel" style={{ marginBottom: '1rem' }}>
                        <h2 className="panel-title">
                            <span className="icon">🔍</span> Search &amp; Filter
                        </h2>
                        <div className="search-filter-bar">
                            <div className="search-wrapper">
                                <span className="search-icon">🔍</span>
                                <input
                                    id="search-courses"
                                    className="search-input"
                                    type="text"
                                    placeholder="Search by name, instructor, or description..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                            <select
                                id="filter-instructor"
                                className="filter-select"
                                value={filterInstructor}
                                onChange={(e) => setFilterInstructor(e.target.value)}
                            >
                                <option value="">All Instructors</option>
                                {instructors.map((inst) => (
                                    <option key={inst} value={inst}>{inst}</option>
                                ))}
                            </select>
                        </div>
                        {(search || filterInstructor) && (
                            <p className="results-info">
                                Showing <span>{filteredCourses.length}</span> of {courses.length} courses
                                {search && <> matching &ldquo;<span>{search}</span>&rdquo;</>}
                                {filterInstructor && <> by <span>{filterInstructor}</span></>}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading">
                            <div className="spinner" />
                            Loading courses...
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <p className="empty-title">
                                {courses.length === 0 ? 'No courses yet' : 'No results found'}
                            </p>
                            <p className="empty-text">
                                {courses.length === 0
                                    ? 'Create your first course using the form on the left.'
                                    : 'Try adjusting your search or filter.'}
                            </p>
                        </div>
                    ) : (
                        <div className="courses-grid">
                            {filteredCourses.map((course) => (
                                <CourseCard
                                    key={course._id}
                                    course={course}
                                    onDelete={handleDelete}
                                    onEdit={handleEditOpen}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Edit Modal ── */}
            {editCourse && (
                <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditCourse(null); }}>
                    <div className="modal">
                        <h2 className="modal-title">✏️ Edit Course</h2>
                        {editError && <div className="alert alert-error">⚠️ {editError}</div>}
                        <form onSubmit={handleEditSave}>
                            <div className="form-group">
                                <label className="form-label">Course Name</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={editForm.courseName}
                                    onChange={(e) => setEditForm({ ...editForm, courseName: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    value={editForm.courseDescription}
                                    onChange={(e) => setEditForm({ ...editForm, courseDescription: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Instructor</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={editForm.instructor}
                                    onChange={(e) => setEditForm({ ...editForm, instructor: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setEditCourse(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                                    {editLoading ? '⏳ Saving...' : '💾 Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

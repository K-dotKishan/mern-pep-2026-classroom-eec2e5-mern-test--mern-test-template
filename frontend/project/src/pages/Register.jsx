import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            return setError('All fields are required');
        }
        if (form.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }
        try {
            setLoading(true);
            const { data } = await axios.post('/api/auth/register', form);
            login(data.token, data.student);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-icon">🎓</div>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join CourseHub to start learning</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            id="register-name"
                            className="form-input"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={handleChange}
                            autoComplete="name"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            id="register-email"
                            className="form-input"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            id="register-password"
                            className="form-input"
                            type="password"
                            name="password"
                            placeholder="Min 6 characters"
                            value={form.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>
                    <button
                        id="register-submit"
                        className="btn btn-primary btn-block"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? '⏳ Creating account...' : '🚀 Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

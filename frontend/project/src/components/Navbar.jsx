import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/dashboard" className="navbar-brand">
                <div className="brand-icon">🎓</div>
                CourseHub
            </Link>
            <div className="navbar-right">
                {user && (
                    <p className="navbar-user">
                        Welcome, <span>{user.name}</span>
                    </p>
                )}
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                    🚪 Logout
                </button>
            </div>
        </nav>
    );
}

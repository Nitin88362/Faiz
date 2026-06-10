import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    window.location.reload();
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/features', label: 'Features' },
    { path: '/pricing', label: 'Pricing' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-500">
          Translator
        </Link>
        <nav className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-gray-300 hover:text-purple-500 transition-colors ${
                location.pathname === item.path ? 'text-purple-500' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              <span className="text-gray-300">{user.username}</span>
              <Link to="/dashboard" className="text-purple-500 hover:text-purple-400 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="border border-red-500 px-4 py-2 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-purple-500 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="neon-button px-4 py-2 rounded-lg text-white font-semibold">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;

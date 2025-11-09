import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navigation() {
  const navigate = useNavigate();
  const { isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent hover:from-white hover:to-white transition-all duration-300">
            RateMyClass
          </Link>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/')
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/add-rating"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive('/add-rating')
                  ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Add Rating
            </Link>
            {isAdmin() && (
              <Link
                to="/add-course"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/add-course')
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                Add Course
              </Link>
            )}
            {isAdmin() ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-fadeIn">
            <div className="flex flex-col space-y-2 mt-4">
              <Link
                to="/"
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/')
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/add-rating"
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive('/add-rating')
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Add Rating
              </Link>
              {isAdmin() && (
                <Link
                  to="/add-course"
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive('/add-course')
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Add Course
                </Link>
              )}
              {isAdmin() ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-blue-100 hover:bg-white/10 hover:text-white transition-all duration-200 text-left"
                >
                  Logout
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;

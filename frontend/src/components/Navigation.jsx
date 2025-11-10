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
    <nav className="bg-retro-dark border-b-2 border-retro-cyan/40 text-white shadow-lg sticky top-0 z-50" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #080810 100%)' }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-bold retro-text text-retro-cyan hover:text-retro-pink transition-colors">
            RateMyClass
          </Link>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 border-2 border-retro-cyan/40 hover:bg-retro-cyan/10 transition-all"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
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
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Link
              to="/"
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 transition-all ${
                isActive('/')
                  ? 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/60 shadow-md'
                  : 'border-retro-cyan/40 text-retro-cyan/80 hover:bg-retro-cyan/10 hover:text-retro-cyan'
              }`}
            >
              Home
            </Link>
            <Link
              to="/add-rating"
              className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 transition-all ${
                isActive('/add-rating')
                  ? 'bg-retro-pink/20 text-retro-pink border-retro-pink/60 shadow-md'
                  : 'border-retro-pink/40 text-retro-pink/80 hover:bg-retro-pink/10 hover:text-retro-pink'
              }`}
            >
              Add Rating
            </Link>
            {isAdmin() && (
              <Link
                to="/add-course"
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide border-2 transition-all ${
                  isActive('/add-course')
                    ? 'bg-retro-purple/20 text-retro-purple border-retro-purple/60 shadow-md'
                    : 'border-retro-purple/40 text-retro-purple/80 hover:bg-retro-purple/10 hover:text-retro-purple'
                }`}
              >
                Add Course
              </Link>
            )}
            {isAdmin() ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm font-semibold uppercase tracking-wide border-2 border-retro-orange/40 text-retro-orange/80 hover:bg-retro-orange/10 hover:text-retro-orange transition-all"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>

        {/* Mobile navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 animate-slide">
            <div className="flex flex-col space-y-2 mt-4">
              <Link
                to="/"
                className={`px-4 py-3 text-sm font-semibold uppercase tracking-wide border-2 transition-all ${
                  isActive('/')
                    ? 'bg-retro-cyan/20 text-retro-cyan border-retro-cyan/60'
                    : 'border-retro-cyan/40 text-retro-cyan/80 hover:bg-retro-cyan/10 hover:text-retro-cyan'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/add-rating"
                className={`px-4 py-3 text-sm font-semibold uppercase tracking-wide border-2 transition-all ${
                  isActive('/add-rating')
                    ? 'bg-retro-pink/20 text-retro-pink border-retro-pink/60'
                    : 'border-retro-pink/40 text-retro-pink/80 hover:bg-retro-pink/10 hover:text-retro-pink'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Add Rating
              </Link>
              {isAdmin() && (
                <Link
                  to="/add-course"
                  className={`px-4 py-3 text-sm font-semibold uppercase tracking-wide border-2 transition-all ${
                    isActive('/add-course')
                      ? 'bg-retro-purple/20 text-retro-purple border-retro-purple/60'
                      : 'border-retro-purple/40 text-retro-purple/80 hover:bg-retro-purple/10 hover:text-retro-purple'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Add Course
                </Link>
              )}
              {isAdmin() ? (
                <button
                  onClick={handleLogout}
                  className="px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide border-2 border-retro-orange/40 text-retro-orange/80 hover:bg-retro-orange/10 hover:text-retro-orange transition-all text-left"
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

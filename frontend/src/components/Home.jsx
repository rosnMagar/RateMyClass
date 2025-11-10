import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, generateStarRating } from '../services/api';
import { StarIcon, StarHalfIcon } from './StarIcon';

function CourseCard({ course }) {
  const navigate = useNavigate();
  const { fullStars, hasHalfStar, emptyStars } = generateStarRating(course.average_rating || 0);
  const ratingCount = course.rating_count || 0;

  const handleClick = () => {
    navigate(`/course/${course.course_id}`);
  };

  return (
    <div className="md:w-1/2 lg:w-1/3 px-4 mb-6">
      <div 
        className="card-modern h-full p-6 cursor-pointer group"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-retro-pink transition-colors uppercase">
              {course.course_name}
            </h3>
            <p className="text-sm font-bold text-retro-cyan mb-4 border-2 border-retro-cyan inline-block px-2 py-1">{course.course_number}</p>
          </div>
          <div className="ml-2">
            <div className="w-16 h-16 bg-gradient-to-br from-retro-pink/80 to-retro-purple/80 flex items-center justify-center text-white font-bold border-2 border-retro-cyan/50 shadow-md">
              {(course.average_rating || 0).toFixed(1)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: fullStars }).map((_, i) => (
              <StarIcon key={i} filled={true} />
            ))}
            {hasHalfStar && <StarHalfIcon />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <StarIcon key={`empty-${i}`} filled={false} />
            ))}
          </div>
          {ratingCount > 0 && (
            <span className="ml-2 text-sm text-white font-bold">
              ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-retro-blue/70 text-white text-xs font-semibold border border-retro-cyan/50 uppercase">
              {course.major}
            </span>
            <span className="px-3 py-1 bg-retro-purple/70 text-white text-xs font-semibold border border-retro-cyan/50 uppercase">
              {course.delivery_mode}
            </span>
            {course.dialogues_requirement && (
              <span className="px-3 py-1 bg-retro-pink/70 text-white text-xs font-semibold border border-retro-cyan/50 uppercase">
                {course.dialogues_requirement}
              </span>
            )}
          </div>
          {course.school_name && (
            <p className="text-sm text-white font-bold uppercase">{course.school_name}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async (search = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCourses(search);
      setCourses(data);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Error loading courses. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadCourses(searchTerm);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 retro-title text-retro-cyan">
            FIND YOUR COURSE
          </h1>
          <p className="text-xl text-retro-pink/90 mb-8 max-w-2xl mx-auto font-semibold uppercase tracking-wide">
            Discover courses, read reviews, and make informed decisions
          </p>
          
          {/* Search Section */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  className="input-modern pr-12 text-lg"
                  placeholder="Search by Course Name, Course Number, Major..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-retro-cyan hover:text-retro-pink transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                className="btn-primary-modern px-8"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Featured Courses Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold retro-text text-retro-pink/90 mb-2">FEATURED COURSES</h2>
          <p className="text-retro-cyan/80 font-semibold uppercase tracking-wide">Explore courses rated by students</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin h-16 w-16 border-4 border-retro-dark border-t-retro-cyan mb-4" style={{ borderRadius: '50%' }}></div>
            </div>
            <p className="text-retro-cyan text-lg font-bold uppercase tracking-wider">Loading courses...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border-4 border-retro-orange text-retro-yellow p-6 mb-6 shadow-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-bold uppercase">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-retro-dark border-4 border-retro-cyan flex items-center justify-center" style={{ borderRadius: '50%' }}>
              <svg className="w-12 h-12 text-retro-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-retro-pink text-xl font-bold uppercase retro-text">No courses found.</p>
            <p className="text-retro-cyan mt-2 font-bold uppercase tracking-wider">Try adjusting your search criteria</p>
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <div className="flex flex-wrap -mx-4">
            {courses.map((course) => (
              <CourseCard key={course.course_id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;


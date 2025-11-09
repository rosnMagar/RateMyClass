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
            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
              {course.course_name}
            </h3>
            <p className="text-sm font-medium text-indigo-600 mb-4">{course.course_number}</p>
          </div>
          <div className="ml-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
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
            <span className="ml-2 text-sm text-gray-500 font-medium">
              ({ratingCount} {ratingCount === 1 ? 'rating' : 'ratings'})
            </span>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              {course.major}
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
              {course.delivery_mode}
            </span>
            {course.dialogues_requirement && (
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                {course.dialogues_requirement}
              </span>
            )}
          </div>
          {course.school_name && (
            <p className="text-sm text-gray-600 font-medium">{course.school_name}</p>
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
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Find Your Course
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover courses, read reviews, and make informed decisions about your education
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
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
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Courses</h2>
          <p className="text-gray-600">Explore courses rated by students</p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
            </div>
            <p className="text-gray-600 text-lg font-medium">Loading courses...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-xl mb-6 shadow-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-600 text-xl font-medium">No courses found.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria</p>
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


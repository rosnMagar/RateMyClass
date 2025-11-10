import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, generateStarRating } from '../services/api';
import { StarIcon, StarHalfIcon } from './StarIcon';

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourseDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const loadCourseDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCourseDetail(courseId);
      setCourse(data);
    } catch (err) {
      console.error('Error loading course detail:', err);
      setError('Failed to load course details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin h-16 w-16 border-4 border-retro-dark border-t-retro-cyan mb-4" style={{ borderRadius: '50%' }}></div>
          </div>
          <p className="text-retro-cyan text-lg font-bold uppercase tracking-wider">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="card-modern p-8 max-w-2xl mx-auto">
          <div className="bg-red-900 border-4 border-retro-orange text-retro-yellow p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-bold uppercase">{error || 'Course not found'}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="btn-primary-modern"
            type="button"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { fullStars, hasHalfStar, emptyStars } = generateStarRating(course.average_rating || 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-8 text-retro-cyan hover:text-retro-pink flex items-center font-bold uppercase tracking-wider group transition-all duration-200 cursor-pointer"
        type="button"
      >
        <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Courses
      </button>

      {/* Course Header */}
      <div className="card-modern p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2 retro-title text-retro-pink/90 uppercase">
              {course.course_name}
            </h1>
            <p className="text-xl font-semibold text-retro-blue/90 mb-6 border-2 border-retro-blue/50 inline-block px-4 py-2">{course.course_number}</p>
          </div>
          <div className="ml-6">
            <div className="w-20 h-20 bg-gradient-to-br from-retro-pink/80 to-retro-purple/80 flex items-center justify-center text-white font-bold text-2xl border-2 border-retro-cyan/50 shadow-md">
              {(course.average_rating || 0).toFixed(1)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: fullStars }).map((_, i) => (
              <StarIcon key={i} filled={true} />
            ))}
            {hasHalfStar && <StarHalfIcon />}
            {Array.from({ length: emptyStars }).map((_, i) => (
              <StarIcon key={`empty-${i}`} filled={false} />
            ))}
          </div>
          <span className="ml-3 text-xl font-bold text-white">
            {(course.average_rating || 0).toFixed(1)}
          </span>
          <span className="ml-3 text-white font-bold uppercase">
            ({course.rating_count} {course.rating_count === 1 ? 'rating' : 'ratings'})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-retro-dark/50 border-2 border-retro-blue/50">
            <span className="text-sm font-semibold text-retro-cyan/80 uppercase tracking-wide">School</span>
            <p className="text-lg font-semibold text-white mt-1 uppercase">{course.school_name}</p>
          </div>
          <div className="p-4 bg-retro-dark/50 border-2 border-retro-purple/50">
            <span className="text-sm font-semibold text-retro-cyan/80 uppercase tracking-wide">Major</span>
            <p className="text-lg font-semibold text-white mt-1 uppercase">{course.major}</p>
          </div>
          <div className="p-4 bg-retro-dark/50 border-2 border-retro-pink/50">
            <span className="text-sm font-semibold text-retro-cyan/80 uppercase tracking-wide">Delivery Mode</span>
            <p className="text-lg font-semibold text-white mt-1 uppercase">{course.delivery_mode}</p>
          </div>
          {course.dialogues_requirement && (
            <div className="p-4 bg-retro-dark/50 border-2 border-retro-yellow/50">
              <span className="text-sm font-semibold text-retro-cyan/80 uppercase tracking-wide">Dialogues Requirement</span>
              <p className="text-lg font-semibold text-white mt-1 uppercase">{course.dialogues_requirement}</p>
            </div>
          )}
        </div>
      </div>

      {/* Ratings Section */}
      <div className="card-modern p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold retro-text text-retro-pink/90 uppercase">Ratings & Reviews</h2>
          <span className="px-4 py-2 bg-retro-dark/50 text-retro-cyan/90 text-sm font-semibold border-2 border-retro-cyan/50 uppercase">
            {course.ratings ? course.ratings.length : 0} {(course.ratings ? course.ratings.length : 0) === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>
        
        {course.ratings && course.ratings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-retro-dark border-4 border-retro-cyan flex items-center justify-center" style={{ borderRadius: '50%' }}>
              <svg className="w-10 h-10 text-retro-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <p className="text-white text-lg font-bold uppercase retro-text">No ratings yet</p>
            <p className="text-retro-cyan mt-2 font-bold uppercase tracking-wider">Be the first to rate this course!</p>
          </div>
        ) : course.ratings && course.ratings.length > 0 ? (
          <div className="space-y-6">
            {course.ratings.map((rating) => {
              const ratingStars = generateStarRating(rating.rating);
              const date = new Date(rating.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div key={rating.rating_id} className="p-6 bg-retro-dark/50 border-2 border-retro-cyan/50 hover:border-retro-pink/60 transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: ratingStars.fullStars }).map((_, i) => (
                          <StarIcon key={i} filled={true} />
                        ))}
                        {ratingStars.hasHalfStar && <StarHalfIcon />}
                        {Array.from({ length: ratingStars.emptyStars }).map((_, i) => (
                          <StarIcon key={`empty-${i}`} filled={false} />
                        ))}
                      </div>
                      <span className="ml-2 font-semibold text-retro-yellow/90 text-lg">{rating.rating}/5</span>
                    </div>
                    <span className="text-sm text-retro-cyan/80 font-semibold bg-retro-dark/50 px-3 py-1 border border-retro-cyan/50 uppercase">
                      {date}
                    </span>
                  </div>
                  <p className="text-white/90 whitespace-pre-wrap leading-relaxed font-medium">{rating.review}</p>
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CourseDetail;


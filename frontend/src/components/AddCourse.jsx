import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import StarRating from './StarRating';

function AddCourse() {
  const navigate = useNavigate();
  const { isAdmin, getToken } = useAuth();
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isNewCourse, setIsNewCourse] = useState(true);
  const [textbookRequired, setTextbookRequired] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    school_id: '',
    school_name: '',
    course_id: '',
    course_name: '',
    course_number: '',
    major: '',
    dialogues_requirement: '',
    delivery_mode: '',
    rating: '',
    review: '',
    textbook: ''
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/login');
      return;
    }
    loadSchools();
  }, [navigate, isAdmin]);

  useEffect(() => {
    if (formData.school_id) {
      loadCoursesForSchool(formData.school_id);
      // Pre-select Truman State University if found
      const truman = schools.find(s => s.school_name.toLowerCase().includes('truman'));
      if (truman && !formData.school_id) {
        setFormData(prev => ({
          ...prev,
          school_id: truman.school_id.toString(),
          school_name: truman.school_name
        }));
      }
    }
  }, [formData.school_id]);

  const loadSchools = async () => {
    try {
      setLoadingSchools(true);
      const data = await api.getSchools();
      setSchools(data);
      // Pre-select Truman State University if found
      const truman = data.find(s => s.school_name.toLowerCase().includes('truman'));
      if (truman) {
        setFormData(prev => ({
          ...prev,
          school_id: truman.school_id.toString(),
          school_name: truman.school_name
        }));
        loadCoursesForSchool(truman.school_id);
      }
    } catch (err) {
      console.error('Error loading schools:', err);
      setError('Failed to load schools. Please refresh the page.');
    } finally {
      setLoadingSchools(false);
    }
  };

  const loadCoursesForSchool = async (schoolId) => {
    try {
      setLoadingCourses(true);
      const data = await api.getCoursesBySchool(schoolId);
      setCourses(data);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError('Failed to load courses for selected school.');
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // If school dropdown changes, update school_name
    if (name === 'school_id') {
      const selectedSchool = schools.find(s => s.school_id.toString() === value);
      if (selectedSchool) {
        setFormData(prev => ({
          ...prev,
          school_name: selectedSchool.school_name
        }));
      }
    }

    // If course dropdown changes, populate course details
    if (name === 'course_id' && value) {
      const selectedCourse = courses.find(c => c.course_id.toString() === value);
      if (selectedCourse) {
        setFormData(prev => ({
          ...prev,
          course_name: selectedCourse.course_name,
          course_number: selectedCourse.course_number,
          major: selectedCourse.major
        }));
        setIsNewCourse(false);
      }
    }
  };

  const handleNewCourseToggle = () => {
    setIsNewCourse(!isNewCourse);
    if (!isNewCourse) {
      // Clear course selection when switching to new course
      setFormData(prev => ({
        ...prev,
        course_id: '',
        course_name: '',
        course_number: '',
        major: ''
      }));
    }
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.rating) {
      alert('Please select a rating before submitting.');
      return;
    }

    if (!formData.school_id) {
      alert('Please select a school.');
      return;
    }

    if (!isNewCourse && !formData.course_id) {
      alert('Please select a course or choose to add a new course.');
      return;
    }

    if (isNewCourse && (!formData.course_name || !formData.course_number || !formData.major)) {
      alert('Please fill in all required course details for new course.');
      return;
    }

    if (textbookRequired && !formData.textbook) {
      alert('Please enter the textbook title or ISBN since textbook is required.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const courseData = {
        course_name: formData.course_name,
        course_number: formData.course_number,
        major: formData.major,
        school_name: formData.school_name,
        dialogues_requirement: formData.dialogues_requirement || null,
        delivery_mode: formData.delivery_mode,
        rating: parseInt(formData.rating),
        review: formData.review,
        textbook: textbookRequired ? (formData.textbook || null) : null
      };

      const token = getToken();
      await api.createCourse(courseData, token);
      alert('Course and rating created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error submitting course:', err);
      setError(err.message);
      alert('Error submitting course: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              Add New Course
            </h1>
            <p className="text-gray-600 text-lg">Create a new course and add its first rating</p>
          </div>
          
          <div className="card-modern p-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-lg" role="alert">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="font-semibold">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Selection */}
              <div>
                <label htmlFor="school" className="block text-sm font-semibold text-gray-700 mb-3">
                  School (University) <span className="text-red-500">*</span>
                </label>
                <select
                  id="school"
                  name="school_id"
                  value={formData.school_id}
                  onChange={handleChange}
                  className="input-modern"
                  required
                  disabled={loadingSchools}
                >
                  <option value="">{loadingSchools ? 'Loading schools...' : 'Select a school'}</option>
                  {schools.map((school) => (
                    <option key={school.school_id} value={school.school_id}>
                      {school.school_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Course Selection */}
              {formData.school_id && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Course <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleNewCourseToggle}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold underline"
                    >
                      {isNewCourse ? 'Select existing course' : 'Add new course'}
                    </button>
                  </div>

                  {!isNewCourse ? (
                    <select
                      id="course"
                      name="course_id"
                      value={formData.course_id}
                      onChange={handleChange}
                      className="input-modern"
                      required={!isNewCourse}
                      disabled={loadingCourses}
                    >
                      <option value="">{loadingCourses ? 'Loading courses...' : 'Select a course'}</option>
                      {courses.map((course) => (
                        <option key={course.course_id} value={course.course_id}>
                          {course.course_number} - {course.course_name} ({course.major})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-indigo-200">
                      <div>
                        <label htmlFor="courseName" className="block text-sm font-semibold text-gray-700 mb-3">
                          Course Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="courseName"
                          name="course_name"
                          value={formData.course_name}
                          onChange={handleChange}
                          className="input-modern"
                          required={isNewCourse}
                        />
                      </div>

                      <div>
                        <label htmlFor="courseNumber" className="block text-sm font-semibold text-gray-700 mb-3">
                          Course Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="courseNumber"
                          name="course_number"
                          value={formData.course_number}
                          onChange={handleChange}
                          className="input-modern"
                          required={isNewCourse}
                        />
                      </div>

                      <div>
                        <label htmlFor="major" className="block text-sm font-semibold text-gray-700 mb-3">
                          Major <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="major"
                          name="major"
                          value={formData.major}
                          onChange={handleChange}
                          className="input-modern"
                          required={isNewCourse}
                        />
                      </div>
                    </div>
                  )}

                  {/* Display course info if existing course is selected */}
                  {!isNewCourse && formData.course_id && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl">
                      <p className="text-sm text-gray-700 font-semibold mb-1">
                        <span className="text-indigo-600">Course:</span> {formData.course_name}
                      </p>
                      <p className="text-sm text-gray-700 font-semibold mb-1">
                        <span className="text-indigo-600">Number:</span> {formData.course_number}
                      </p>
                      <p className="text-sm text-gray-700 font-semibold">
                        <span className="text-indigo-600">Major:</span> {formData.major}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Dialogues Requirement */}
              <div>
                <label htmlFor="dialoguesRequirement" className="block text-sm font-semibold text-gray-700 mb-3">
                  Dialogues Requirement <span className="text-red-500">*</span>
                </label>
                <select
                  id="dialoguesRequirement"
                  name="dialogues_requirement"
                  value={formData.dialogues_requirement}
                  onChange={handleChange}
                  className="input-modern"
                  required
                >
                  <option value="">Select an option</option>
                  <option value="STEM">STEM</option>
                  <option value="Arts & Humanities">Arts & Humanities</option>
                  <option value="Social Science">Social Science</option>
                  <option value="None">None</option>
                </select>
              </div>

              {/* Delivery Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Delivery Mode <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200">
                    <input
                      type="radio"
                      name="delivery_mode"
                      value="Online"
                      checked={formData.delivery_mode === 'Online'}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      required
                    />
                    <span className="text-gray-700 font-medium">Online</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200">
                    <input
                      type="radio"
                      name="delivery_mode"
                      value="In-Person"
                      checked={formData.delivery_mode === 'In-Person'}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      required
                    />
                    <span className="text-gray-700 font-medium">In-Person</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200">
                    <input
                      type="radio"
                      name="delivery_mode"
                      value="Hybrid"
                      checked={formData.delivery_mode === 'Hybrid'}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      required
                    />
                    <span className="text-gray-700 font-medium">Hybrid</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                  <StarRating
                    rating={formData.rating}
                    onRatingChange={handleRatingChange}
                  />
                </div>
              </div>

              {/* Review */}
              <div>
                <label htmlFor="review" className="block text-sm font-semibold text-gray-700 mb-3">
                  Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review"
                  name="review"
                  rows="5"
                  value={formData.review}
                  onChange={handleChange}
                  className="input-modern resize-none"
                  required
                  placeholder="Share your experience with this course..."
                />
              </div>

              {/* Textbook Reference */}
              <div>
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="textbookRequired"
                    checked={textbookRequired}
                    onChange={(e) => {
                      setTextbookRequired(e.target.checked);
                      if (!e.target.checked) {
                        setFormData(prev => ({ ...prev, textbook: '' }));
                      }
                    }}
                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="textbookRequired" className="ml-3 block text-sm font-semibold text-gray-700">
                    Textbook Required?
                  </label>
                </div>
                {textbookRequired && (
                  <div>
                    <label htmlFor="textbook" className="block text-sm font-semibold text-gray-700 mb-3">
                      Textbook Title or ISBN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="textbook"
                      name="textbook"
                      value={formData.textbook}
                      onChange={handleChange}
                      placeholder="Enter textbook title or ISBN"
                      className="input-modern"
                      required={textbookRequired}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary-modern w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Create Course & Rating'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCourse;


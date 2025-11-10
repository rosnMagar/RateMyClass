import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

function AddCourse() {
  const navigate = useNavigate();
  const { isAdmin, getToken } = useAuth();
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [isNewCourse, setIsNewCourse] = useState(true);
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
    delivery_mode: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    try {
      setSubmitting(true);
      setError(null);

      const courseData = {
        course_name: formData.course_name,
        course_number: formData.course_number,
        major: formData.major,
        school_name: formData.school_name,
        dialogues_requirement: formData.dialogues_requirement || null,
        delivery_mode: formData.delivery_mode
      };

      const token = getToken();
      await api.createCourse(courseData, token);
      alert('Course created successfully!');
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
            <h1 className="text-4xl md:text-6xl font-bold mb-4 retro-title text-retro-purple/90">
              ADD NEW COURSE
            </h1>
            <p className="text-retro-cyan/80 text-lg font-semibold uppercase tracking-wide">Create a new course</p>
          </div>
          
          <div className="card-modern p-8">
            {error && (
              <div className="bg-red-900 border-4 border-retro-orange text-retro-yellow px-6 py-4 mb-6 shadow-lg" role="alert">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="font-bold uppercase">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* School Selection */}
              <div>
                <label htmlFor="school" className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  School (University) <span className="text-retro-pink">*</span>
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
                    <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                      Course <span className="text-retro-pink">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleNewCourseToggle}
                      className="text-sm text-retro-cyan hover:text-retro-pink font-bold uppercase tracking-wider underline"
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
                    <div className="space-y-4 p-6 bg-retro-dark/50 border-2 border-dashed border-retro-cyan/50">
                      <div>
                        <label htmlFor="courseName" className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                          Course Name <span className="text-retro-pink">*</span>
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
                        <label htmlFor="courseNumber" className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                          Course Number <span className="text-retro-pink">*</span>
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
                        <label htmlFor="major" className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                          Major <span className="text-retro-pink">*</span>
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
                      <div className="mt-4 p-4 bg-retro-dark/50 border-2 border-retro-cyan/50">
                        <p className="text-sm text-retro-cyan/90 font-semibold mb-1 uppercase">
                          <span className="text-retro-pink/90">Course:</span> {formData.course_name}
                        </p>
                        <p className="text-sm text-retro-cyan/90 font-semibold mb-1 uppercase">
                          <span className="text-retro-pink/90">Number:</span> {formData.course_number}
                        </p>
                        <p className="text-sm text-retro-cyan/90 font-semibold uppercase">
                          <span className="text-retro-pink/90">Major:</span> {formData.major}
                        </p>
                      </div>
                  )}
                </div>
              )}

              {/* Dialogues Requirement */}
              <div>
                <label htmlFor="dialoguesRequirement" className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  Dialogues Requirement <span className="text-retro-pink">*</span>
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
                <label className="block text-sm font-bold text-white mb-3 uppercase tracking-wider">
                  Delivery Mode <span className="text-retro-pink">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border-2 border-retro-blue/50 cursor-pointer hover:border-retro-pink/60 bg-retro-dark/50 transition-all duration-200">
                    <input
                      type="radio"
                      name="delivery_mode"
                      value="Online"
                      checked={formData.delivery_mode === 'Online'}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-retro-blue"
                      required
                    />
                    <span className="text-white font-semibold uppercase">Online</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-retro-purple/50 cursor-pointer hover:border-retro-pink/60 bg-retro-dark/50 transition-all duration-200">
                    <input
                      type="radio"
                      name="delivery_mode"
                      value="In-Person"
                      checked={formData.delivery_mode === 'In-Person'}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-retro-purple"
                      required
                    />
                    <span className="text-white font-semibold uppercase">In-Person</span>
                  </label>
                  <label className="flex items-center p-4 border-2 border-retro-pink/50 cursor-pointer hover:border-retro-cyan/60 bg-retro-dark/50 transition-all duration-200">
                    <input
                      type="radio"
                      name="delivery_mode"
                      value="Hybrid"
                      checked={formData.delivery_mode === 'Hybrid'}
                      onChange={handleChange}
                      className="mr-3 h-4 w-4 text-retro-pink"
                      required
                    />
                    <span className="text-white font-semibold uppercase">Hybrid</span>
                  </label>
                </div>
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
                    'Create Course'
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


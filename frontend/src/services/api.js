// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Service Functions
export const api = {
  // Get all schools
  async getSchools() {
    const response = await fetch(`${API_BASE_URL}/schools`);
    if (!response.ok) {
      throw new Error('Failed to load schools');
    }
    return response.json();
  },

  // Get courses for a specific school
  async getCoursesBySchool(schoolId) {
    const response = await fetch(`${API_BASE_URL}/schools/${schoolId}/courses`);
    if (!response.ok) {
      throw new Error('Failed to load courses');
    }
    return response.json();
  },

  // Get all courses with optional search
  async getCourses(searchTerm = '') {
    const url = searchTerm 
      ? `${API_BASE_URL}/courses?search=${encodeURIComponent(searchTerm)}`
      : `${API_BASE_URL}/courses`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to load courses');
    }
    return response.json();
  },

  // Get a specific course by ID
  async getCourse(courseId) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}`);
    if (!response.ok) {
      throw new Error('Failed to load course');
    }
    return response.json();
  },

  // Get course detail with all ratings
  async getCourseDetail(courseId) {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/detail`);
    if (!response.ok) {
      throw new Error('Failed to load course details');
    }
    return response.json();
  },

  // Create a new course with rating (admin only)
  async createCourse(courseData, token) {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create course');
    }

    return response.json();
  },

  // Create a rating for an existing course (no auth required)
  async createRating(ratingData) {
    const response = await fetch(`${API_BASE_URL}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to submit rating');
    }

    return response.json();
  },

  // Admin login
  async login(username, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    return response.json();
  }
};

// Utility function to escape HTML
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Function to generate star rating HTML
export function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    fullStars,
    hasHalfStar,
    emptyStars
  };
}


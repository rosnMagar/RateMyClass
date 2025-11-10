import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Home from './components/Home';
import AddRating from './components/AddRating';
import AddCourse from './components/AddCourse';
import Login from './components/Login';
import CourseDetail from './components/CourseDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-animated" style={{ position: 'relative', zIndex: 2 }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-rating" element={<AddRating />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/course/:courseId" element={<CourseDetail />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


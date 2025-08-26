import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import VideoPlayer from './components/VideoPlayer';
import Assessment from './components/Assessment';
import Certificate from './components/Certificate';
import Recommendations from './components/Recommendations';
import AllCourses from './components/AllCourses';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  if (loading) {
    return <LoadingSpinner />;
  }


  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onCourseSelect={(course) => {
              setSelectedCourse(course);
              setCurrentPage('course-detail');
            }}
            onNavigate={setCurrentPage}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            onCourseSelect={(course) => {
              setSelectedCourse(course);
              setCurrentPage('course-detail');
            }}
          />
        );
      case 'recommendations':
        return (
          <Recommendations
            onCourseSelect={(course) => {
              setSelectedCourse(course);
              setCurrentPage('course-detail');
            }}
          />
        );
      case 'all-courses':
        return (
          <AllCourses
            onCourseSelect={(course) => {
              setSelectedCourse(course);
              setCurrentPage('course-detail');
            }}
          />
        );
      case 'course-detail':
        return (
          <CourseDetail
            course={selectedCourse}
            onLessonSelect={(lesson) => {
              setSelectedLesson(lesson);
              setCurrentPage('video-player');
            }}
            onAssessmentStart={() => setCurrentPage('assessment')}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      case 'video-player':
        return (
          <VideoPlayer
            lesson={selectedLesson}
            course={selectedCourse}
            onComplete={() => setCurrentPage('course-detail')}
            onBack={() => setCurrentPage('course-detail')}
          />
        );
      case 'assessment':
        return (
          <Assessment
            course={selectedCourse}
            onComplete={(passed) => {
              if (passed) {
                setCurrentPage('certificate');
              } else {
                setCurrentPage('course-detail');
              }
            }}
            onBack={() => setCurrentPage('course-detail')}
          />
        );
      case 'certificate':
        return (
          <Certificate
            course={selectedCourse}
            onBack={() => setCurrentPage('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <Navigation
          currentPage={currentPage}
          onNavigate={(page) => {
            setCurrentPage(page);
            if (page === 'dashboard' || page === 'home') {
              setSelectedCourse(null);
              setSelectedLesson(null);
            }
          }}
        />
      )}
      <main>
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <AppContent />
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
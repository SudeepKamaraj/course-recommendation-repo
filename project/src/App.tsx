import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
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
import AdminCourses from './components/AdminCourses';


function AppContent() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  // Optionally, you can use context for selectedCourse/selectedLesson if needed globally
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null);
  const [selectedLesson, setSelectedLesson] = React.useState<any>(null);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <Navigation />
      )}
      <main>
        <Routes>
          <Route path="/" element={
            <HomePage
              onCourseSelect={(course) => {
                setSelectedCourse(course);
                navigate(`/courses/${course._id}`);
              }}
            />
          } />
          <Route path="/dashboard" element={
            <Dashboard
              onCourseSelect={(course) => {
                setSelectedCourse(course);
                navigate(`/courses/${course._id}`);
              }}
            />
          } />
          <Route path="/recommendations" element={
            <Recommendations
              onCourseSelect={(course) => {
                setSelectedCourse(course);
                navigate(`/courses/${course._id}`);
              }}
            />
          } />
          <Route path="/all-courses" element={
            <AllCourses
              onCourseSelect={(course) => {
                setSelectedCourse(course);
                navigate(`/courses/${course._id}`);
              }}
            />
          } />
          <Route path="/admin-courses" element={<AdminCourses />} />
          <Route path="/courses/:courseId" element={
            <CourseDetail
              course={selectedCourse}
              onLessonSelect={(lesson) => {
                setSelectedLesson(lesson);
                navigate(`/courses/${selectedCourse?._id}/lessons/${lesson._id}`);
              }}
              onAssessmentStart={() => navigate(`/courses/${selectedCourse?._id}/assessment`)}
              onBack={() => navigate('/dashboard')}
            />
          } />
          <Route path="/courses/:courseId/lessons/:lessonId" element={
            <VideoPlayer
              lesson={selectedLesson}
              course={selectedCourse}
              onComplete={() => navigate(`/courses/${selectedCourse?._id}`)}
              onBack={() => navigate(`/courses/${selectedCourse?._id}`)}
            />
          } />
          <Route path="/courses/:courseId/assessment" element={
            <Assessment
              course={selectedCourse}
              onComplete={(passed) => {
                if (passed) {
                  navigate(`/courses/${selectedCourse?._id}/certificate`);
                } else {
                  navigate(`/courses/${selectedCourse?._id}`);
                }
              }}
              onBack={() => navigate(`/courses/${selectedCourse?._id}`)}
            />
          } />
          <Route path="/courses/:courseId/certificate" element={
            <Certificate
              course={selectedCourse}
              onBack={() => navigate('/dashboard')}
            />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router>
          <AppContent />
        </Router>
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;
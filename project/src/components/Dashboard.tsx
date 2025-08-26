import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { Clock, Users, Star, TrendingUp, Award, BookOpen, Search, Filter, Zap, Target, Rocket, Brain } from 'lucide-react';

interface DashboardProps {
  onCourseSelect: (course: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCourseSelect }) => {
  const { user } = useAuth();
  const { courses, getRecommendedCourses, getCourseProgress, isCourseCompleted } = useCourses();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('recommended');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const recommendedCourses = getRecommendedCourses(user?.skills || [], user?.learningHistory || []);
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const inProgressCourses = courses.filter(course => {
    const progress = getCourseProgress(course.id, user?.id || '');
    return progress > 0 && progress < 100;
  });

  const completedCourses = courses.filter(course => {
    return isCourseCompleted(course.id, user?.id || '');
  });

  const CourseCard: React.FC<{ course: any; showProgress?: boolean }> = ({ course, showProgress = false }) => {
    const progress = showProgress ? getCourseProgress(course.id, user?.id || '') : 0;
    
    return (
      <div
        onClick={() => onCourseSelect(course)}
        className="group relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-white/20 hover:border-white/40 hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="relative overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Floating level badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md border border-white/20 ${
                course.level === 'Beginner' ? 'bg-emerald-500/90 text-white' :
                course.level === 'Intermediate' ? 'bg-amber-500/90 text-white' :
                'bg-red-500/90 text-white'
              }`}>
                {course.level}
              </span>
            </div>
            
            {/* Floating price badge */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
              <span className="text-sm font-bold text-gray-900">${course.price}</span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              {course.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {course.description}
            </p>
            
            {/* Enhanced stats with icons */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-2 bg-gray-50/50 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50/50 px-3 py-1 rounded-full">
                <Users className="w-4 h-4 text-green-500" />
                <span className="font-medium">{course.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50/50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{course.rating}</span>
              </div>
            </div>
            
            {/* Enhanced skill tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {course.skills.slice(0, 3).map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 text-xs rounded-full font-medium border border-blue-200/50 backdrop-blur-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
            
            <p className="text-gray-700 font-semibold text-sm mb-4">
              by {course.instructor}
            </p>
            
            {showProgress && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600 font-medium">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with animated gradient */}
        <div className="mb-12 text-center">
          <div className="inline-block mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              Welcome back, {user?.name}! 🚀
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Continue your learning journey with AI-powered personalized recommendations
          </p>
        </div>

        {/* Enhanced Stats Cards with glassmorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Enrolled Courses</p>
                <p className="text-3xl font-bold text-gray-900">{inProgressCourses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Skills Mastered</p>
                <p className="text-3xl font-bold text-gray-900">{user?.skills?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Search and Filter with glassmorphism */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/20 mb-12">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for courses, skills, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="pl-12 pr-8 py-4 bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs with glassmorphism */}
        <div className="mb-12">
          <div className="bg-white/50 backdrop-blur-xl rounded-2xl p-2 shadow-xl border border-white/20">
            <div className="flex space-x-2">
              {[
                { id: 'recommended', label: 'Recommended', icon: Zap },
                { id: 'in-progress', label: 'In Progress', icon: Rocket },
                { id: 'completed', label: 'Completed', icon: Award },
                { id: 'all', label: 'All Courses', icon: BookOpen }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeTab === 'recommended' && recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {activeTab === 'in-progress' && inProgressCourses.map((course) => (
            <CourseCard key={course.id} course={course} showProgress={true} />
          ))}
          {activeTab === 'completed' && completedCourses.map((course) => (
            <CourseCard key={course.id} course={course} showProgress={true} />
          ))}
          {activeTab === 'all' && filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Enhanced Empty State */}
        {((activeTab === 'recommended' && recommendedCourses.length === 0) ||
          (activeTab === 'in-progress' && inProgressCourses.length === 0) ||
          (activeTab === 'completed' && completedCourses.length === 0) ||
          (activeTab === 'all' && filteredCourses.length === 0)) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {activeTab === 'completed' ? 'No completed courses yet' : 'No courses found'}
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              {activeTab === 'completed' 
                ? 'Start your learning journey to earn your first certificate! 🎓'
                : 'Try adjusting your search or filter criteria to discover amazing courses'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
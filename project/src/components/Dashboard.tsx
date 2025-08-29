import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses, Course } from '../contexts/CourseContext';
import { BookOpen, Clock, Award, TrendingUp, Search, Filter, Play, CheckCircle, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { courses, getRecommendedCourses } = useCourses();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Filter courses based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course: Course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.level.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  // Get recommended courses (simplified for now)
  const recommendedCourses = courses.slice(0, 3); // Show first 3 courses as recommended

  // Get in-progress courses (simplified)
  const inProgressCourses = courses.slice(0, 2); // Show first 2 courses as in-progress

  // Get completed courses (simplified)
  const completedCourses = courses.slice(0, 1); // Show first course as completed

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your dashboard</h2>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }


  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.firstName}!
              </h1>
              <p className="text-gray-600 mt-1">
                Continue your learning journey and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </span>
              </div>
            </div>
          </div>
          
          {/* User Profile Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-blue-600 text-sm">No skills added yet</p>
                )}
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Interests</h3>
              <p className="text-green-700 text-sm">
                {user.interests || 'No interests specified'}
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Career Objective</h3>
              <p className="text-purple-700 text-sm">
                {user.careerObjective || 'No career objective specified'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-900">{inProgressCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600 font-medium">Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{completedCourses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for courses, skills, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'in-progress', label: 'In Progress', icon: Play },
                { id: 'completed', label: 'Completed', icon: CheckCircle },
                { id: 'recommended', label: 'Recommended', icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Recommended Courses */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {recommendedCourses.map((course: Course) => (
                      <div key={course.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-blue-600">{course.level}</span>
                          <span className="text-sm text-gray-500">{course.duration}</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{course.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">${course.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-600 text-center py-8">
                      No recent activity to display. Start learning to see your progress!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* In Progress Tab */}
            {activeTab === 'in-progress' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Courses in Progress</h3>
                {inProgressCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {inProgressCourses.map((course: Course) => (
                      <div key={course.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{course.duration}</span>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Continue Learning
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
                    <p className="text-gray-600">No courses in progress. Start learning to see your progress!</p>
                  </div>
                )}
              </div>
            )}

            {/* Completed Tab */}
            {activeTab === 'completed' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Completed Courses</h3>
                {completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedCourses.map((course: Course) => (
                      <div key={course.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{course.duration}</span>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            View Certificate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
                    <p className="text-gray-600">No completed courses yet. Keep learning to earn certificates!</p>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Tab */}
            {activeTab === 'recommended' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recommended Courses</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredCourses.slice(0, 6).map((course: Course) => (
                    <div key={course.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-blue-600">{course.level}</span>
                        <span className="text-sm text-gray-500">{course.duration}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{course.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">${course.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
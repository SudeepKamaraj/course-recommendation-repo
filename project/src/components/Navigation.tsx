import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Menu, X, User, LogOut, Settings, Bell, Search } from 'lucide-react';

const Navigation: React.FC = () => {

  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LearnHub</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}
              >
                Home
              </Link>
              <Link
                to="/all-courses"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/all-courses' ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}
              >
                Courses
              </Link>
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}
              >
                Dashboard
              </Link>
              <Link
                to="/recommendations"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/recommendations' ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}
              >
                Recommendations
              </Link>
              {(user?.role === 'admin' || user?.role === 'instructor') && (
                <Link
                  to="/admin-courses"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === '/admin-courses' ? 'text-blue-600' : 'text-gray-900 hover:text-blue-600'}`}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.firstName}</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/profile"
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth"
                  className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-left w-full text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/all-courses"
              onClick={() => setIsMenuOpen(false)}
              className="text-left w-full text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Courses
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsMenuOpen(false)}
              className="text-left w-full text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/recommendations"
              onClick={() => setIsMenuOpen(false)}
              className="text-left w-full text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
            >
              Recommendations
            </Link>
            
            {user && (
              <>
                <hr className="my-2" />
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left w-full text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-left w-full text-gray-900 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-900 hover:text-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
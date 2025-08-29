import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { ArrowLeft, Clock, Users, Star, Award, Play, CheckCircle, Lock } from 'lucide-react';

interface CourseDetailProps {
  course: any;
  onLessonSelect: (lesson: any) => void;
  onAssessmentStart: () => void;
  onBack: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({
  course,
  onLessonSelect,
  onAssessmentStart,
  onBack
}) => {
  const { user } = useAuth();
  const { getCourseProgress, getLastLessonId } = useCourses();

  if (!course) return null;

  const progress = getCourseProgress(course.id, user?.id || '');
  console.log(course);
  const isCompleted = user?.completedCourses?.includes(course.id);
  const lessonProgressKey = `progress_${user?.id}_${course.id}`;
  const lessonProgress = JSON.parse(localStorage.getItem(lessonProgressKey) || '{}');

  const lastLessonId = getLastLessonId(course.id, user?.id || '')
  const lastLesson = lastLessonId ? course.lessons.find((l: any) => l.id === lastLessonId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                  course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {course.level}
                </span>
                {isCompleted && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {course.title}
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{course.rating} rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Certificate included</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">Course Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {lastLesson && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-700">Last lesson: <span className="font-medium">{lastLesson.title}</span></span>
                    <button
                      onClick={() => onLessonSelect(lastLesson)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills You'll Learn</h3>
                <div className="flex flex-wrap gap-2">
                  {course.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instructor</h3>
                <p className="text-gray-600">{course.instructor}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price removed as requested */}

          {/* Curriculum */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Course Content ({course.lessons.length} lessons)
            </h3>
            
            <div className="space-y-3">
              {course.lessons.map((lesson: any, index: number) => {
                const isLessonCompleted = lessonProgress[lesson.id];
                const canAccess = index === 0 || lessonProgress[course.lessons[index - 1].id];
                
                return (
                  <div
                    key={lesson.id}
                    onClick={() => canAccess && onLessonSelect(lesson)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      canAccess
                        ? 'cursor-pointer hover:bg-gray-50 border-gray-200'
                        : 'cursor-not-allowed opacity-60 border-gray-100'
                    } ${
                      isLessonCompleted
                        ? 'bg-green-50 border-green-200'
                        : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {!canAccess ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : isLessonCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Play className="w-5 h-5 text-blue-600" />
                      )}
                      <div>
                        <p className={`font-medium ${
                          isLessonCompleted ? 'text-green-700' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Assessment Button */}
            {progress === 100 && !isCompleted && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={onAssessmentStart}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
                >
                  <Award className="w-5 h-5" />
                  <span>Take Final Assessment</span>
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center text-green-600">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-semibold">Course Completed!</p>
                  <p className="text-sm text-gray-600 mt-1">Certificate earned</p>
                </div>
              </div>
            )}

            {/* Import external video URL for current lesson (admin/user quick add) */}
            {/* <div className="mt-6 pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Import lesson video URL</label>
              <div className="flex gap-2">
                <input
                  id="externalVideoUrl"
                  type="url"
                  placeholder="Paste YouTube/Vimeo/MP4 URL"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('externalVideoUrl') as HTMLInputElement | null;
                    if (!el) return;
                    const url = el.value.trim();
                    if (!url) return;
                    // Save for all lessons or current? We'll save for first lesson for demo
                    const firstLesson = course.lessons[0];
                    if (firstLesson?.id) {
                      localStorage.setItem(`custom_video_url_${firstLesson.id}`, url);
                      el.value = '';
                      alert('Custom video URL saved for the first lesson. Open the lesson to play it.');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Saved per-lesson in your browser. Overrides provider/local video for playback.</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

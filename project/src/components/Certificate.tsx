import React, { useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Award, Download, ArrowLeft, Calendar, Star } from 'lucide-react';

interface CertificateProps {
  course: any;
  onBack: () => void;
}

const Certificate: React.FC<CertificateProps> = ({ course, onBack }) => {
  const { user } = useAuth();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (certificateRef.current) {
      // Use html2canvas to capture the certificate
      import('html2canvas').then((html2canvas) => {
        html2canvas.default(certificateRef.current!, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff'
        }).then((canvas) => {
          const link = document.createElement('a');
          link.download = `${user?.name?.replace(/\s+/g, '_')}-${course.title.replace(/\s+/g, '_')}-Certificate.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      }).catch(() => {
        // Fallback: Create a simple text-based certificate
        const certificateText = `
CERTIFICATE OF COMPLETION

This certifies that
${user?.name}
has successfully completed the course
${course.title}

Completed on: ${new Date().toLocaleDateString()}
Instructor: ${course.instructor}
LearnHub - Online Learning Platform
        `;
        
        const blob = new Blob([certificateText], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `${user?.name?.replace(/\s+/g, '_')}-${course.title.replace(/\s+/g, '_')}-Certificate.txt`;
        link.href = URL.createObjectURL(blob);
        link.click();
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Award className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Congratulations! 🎉
        </h1>
        <p className="text-gray-600">
          You have successfully completed the course and earned your certificate
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-4xl mx-auto">
        {/* Certificate */}
        <div
          ref={certificateRef}
          className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-12 text-center border-8 border-blue-600"
          style={{ aspectRatio: '4/3' }}
        >
          <div className="border-2 border-blue-300 rounded-lg p-8 h-full flex flex-col justify-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Certificate of Completion
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>

            <div className="mb-8">
              <p className="text-lg text-gray-600 mb-4">This certifies that</p>
              <h3 className="text-3xl font-bold text-blue-600 mb-4">
                {user?.name}
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                has successfully completed the course
              </p>
              <h4 className="text-2xl font-bold text-gray-900 mb-6">
                {course.title}
              </h4>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>Course Rating: {course.rating}</span>
              </div>
            </div>

            <div className="border-t-2 border-gray-300 pt-4">
              <p className="text-gray-700 font-medium">
                Instructor: {course.instructor}
              </p>
              <div className="flex items-center justify-center space-x-3 mt-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Award className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-blue-600">LearnHub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Certificate</span>
            </button>
          </div>
          
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Share your achievement on social media or add it to your professional profile
            </p>
          </div>
        </div>
      </div>

      {/* Course Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Course Completed</h3>
          <p className="text-sm text-gray-600">All lessons and assessments passed</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Skills Mastered</h3>
          <p className="text-sm text-gray-600">{course.skills.join(', ')}</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Time Invested</h3>
          <p className="text-sm text-gray-600">{course.duration} of learning</p>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  duration: string; // e.g., '8h 30m'
  students: number;
  rating: number; // 0-5
  skills: string[];
  instructor: string;
  thumbnail: string;
  lessons: Lesson[];
}

interface CourseContextType {
  courses: Course[];
  getRecommendedCourses: (skills: string[], learningHistory: string[]) => Course[];
  getCourseProgress: (courseId: string, userId: string) => number; // 0-100
  updateLessonProgress: (courseId: string, lessonId: string, userId: string) => void;
  getAssessmentQuestions: (courseId: string) => { question: string; options: string[]; correctAnswer: number }[];
  completeCourse: (courseId: string, userId: string) => void;
  isCourseCompleted: (courseId: string, userId: string) => boolean;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourses must be used within CourseProvider');
  return ctx;
};

function generateLessons(prefix: string, count: number, topics?: string[]): Lesson[] {
  const defaultTopics = [
    'Introduction and Setup',
    'Core Concepts',
    'Practical Examples',
    'Advanced Techniques',
    'Best Practices',
    'Real-world Projects',
    'Troubleshooting',
    'Performance Optimization',
    'Security Considerations',
    'Deployment Strategies'
  ];
  
  const lessonTopics = topics || defaultTopics;
  
  return Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-lesson-${i + 1}`,
    title: lessonTopics[i % lessonTopics.length] || `Lesson ${i + 1}`,
    description: 'Comprehensive lesson with hands-on exercises and real-world applications.',
    duration: 600 + (i % 5) * 120 + Math.random() * 300, // 10-25 minutes
  }));
}

const INITIAL_COURSES: Course[] = [
  {
    id: 'react-complete-guide',
    title: 'React Complete Guide',
    description: 'Build modern React applications with hooks, context, and best practices.',
    level: 'Beginner',
    price: 49,
    duration: '12h 10m',
    students: 32500,
    rating: 4.7,
    skills: ['JavaScript', 'React', 'Frontend'],
    instructor: 'Sarah Johnson',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('react', 12),
  },
  {
    id: 'nodejs-mastery',
    title: 'Node.js Mastery',
    description: 'Backend development with Node.js, Express, and MongoDB.',
    level: 'Intermediate',
    price: 59,
    duration: '10h 45m',
    students: 18420,
    rating: 4.6,
    skills: ['Node.js', 'Express', 'MongoDB', 'Backend'],
    instructor: 'Michael Chen',
    thumbnail: 'https://images.pexels.com/photos/1181243/pexels-photo-1181243.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('node', 10),
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Analyze data and build ML models with Python, Pandas, and scikit-learn.',
    level: 'Intermediate',
    price: 69,
    duration: '14h 20m',
    students: 22110,
    rating: 4.8,
    skills: ['Python', 'Data Science', 'Machine Learning', 'Analytics'],
    instructor: 'Priya Singh',
    thumbnail: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('pyds', 14),
  },
  {
    id: 'design-figma',
    title: 'Product Design with Figma',
    description: 'Design beautiful user interfaces and flows using Figma.',
    level: 'Beginner',
    price: 39,
    duration: '7h 30m',
    students: 10230,
    rating: 4.5,
    skills: ['Design', 'UI Design', 'UX Design', 'Figma'],
    instructor: 'Andrea Müller',
    thumbnail: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('figma', 8),
  },
  {
    id: 'cloud-aws-fundamentals',
    title: 'AWS Cloud Fundamentals',
    description: 'Understand core AWS services and deploy scalable architectures.',
    level: 'Advanced',
    price: 79,
    duration: '11h 15m',
    students: 15670,
    rating: 4.6,
    skills: ['Cloud Computing', 'AWS', 'DevOps'],
    instructor: 'Diego Alvarez',
    thumbnail: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('aws', 11),
  },
  {
    id: 'vue-js-complete',
    title: 'Vue.js Complete Course',
    description: 'Master Vue.js 3 with Composition API, Vuex, and Vue Router.',
    level: 'Beginner',
    price: 45,
    duration: '9h 45m',
    students: 12890,
    rating: 4.7,
    skills: ['JavaScript', 'Vue.js', 'Frontend', 'Vuex'],
    instructor: 'Emma Wilson',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('vue', 10),
  },
  {
    id: 'angular-essentials',
    title: 'Angular Essentials',
    description: 'Build scalable applications with Angular framework and TypeScript.',
    level: 'Intermediate',
    price: 55,
    duration: '13h 20m',
    students: 9870,
    rating: 4.5,
    skills: ['TypeScript', 'Angular', 'Frontend', 'RxJS'],
    instructor: 'David Kim',
    thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('angular', 12),
  },
  {
    id: 'mobile-react-native',
    title: 'React Native Mobile Development',
    description: 'Create cross-platform mobile apps with React Native.',
    level: 'Intermediate',
    price: 65,
    duration: '15h 30m',
    students: 14560,
    rating: 4.6,
    skills: ['React Native', 'Mobile Development', 'JavaScript', 'iOS', 'Android'],
    instructor: 'Lisa Rodriguez',
    thumbnail: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('rnative', 14),
  },
  {
    id: 'flutter-app-development',
    title: 'Flutter App Development',
    description: 'Build beautiful native apps with Flutter and Dart.',
    level: 'Intermediate',
    price: 58,
    duration: '12h 45m',
    students: 11230,
    rating: 4.7,
    skills: ['Flutter', 'Dart', 'Mobile Development', 'UI Design'],
    instructor: 'Alex Thompson',
    thumbnail: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('flutter', 11),
  },
  {
    id: 'machine-learning-python',
    title: 'Machine Learning with Python',
    description: 'Implement ML algorithms and build predictive models.',
    level: 'Advanced',
    price: 89,
    duration: '18h 15m',
    students: 18760,
    rating: 4.8,
    skills: ['Python', 'Machine Learning', 'scikit-learn', 'TensorFlow', 'Data Science'],
    instructor: 'Dr. James Miller',
    thumbnail: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('mlpy', 16),
  },
  {
    id: 'deep-learning-tensorflow',
    title: 'Deep Learning with TensorFlow',
    description: 'Master neural networks and deep learning architectures.',
    level: 'Advanced',
    price: 95,
    duration: '20h 30m',
    students: 13450,
    rating: 4.9,
    skills: ['Deep Learning', 'TensorFlow', 'Neural Networks', 'Python', 'AI'],
    instructor: 'Dr. Sophia Chen',
    thumbnail: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('dltf', 18),
  },
  {
    id: 'cybersecurity-fundamentals',
    title: 'Cybersecurity Fundamentals',
    description: 'Learn essential security concepts and protect against threats.',
    level: 'Beginner',
    price: 49,
    duration: '8h 45m',
    students: 22340,
    rating: 4.6,
    skills: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Security'],
    instructor: 'Mark Anderson',
    thumbnail: 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('cyber', 9),
  },
  {
    id: 'blockchain-development',
    title: 'Blockchain Development',
    description: 'Build decentralized applications with Ethereum and Solidity.',
    level: 'Advanced',
    price: 75,
    duration: '16h 20m',
    students: 8760,
    rating: 4.7,
    skills: ['Blockchain', 'Ethereum', 'Solidity', 'Smart Contracts', 'Web3'],
    instructor: 'Crypto Dev',
    thumbnail: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('block', 15),
  },
  {
    id: 'docker-kubernetes',
    title: 'Docker & Kubernetes',
    description: 'Containerize applications and orchestrate with Kubernetes.',
    level: 'Intermediate',
    price: 62,
    duration: '11h 30m',
    students: 15670,
    rating: 4.6,
    skills: ['Docker', 'Kubernetes', 'DevOps', 'Containerization'],
    instructor: 'Robert Lee',
    thumbnail: 'https://images.pexels.com/photos/3861964/pexels-photo-3861964.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('docker', 12),
  },
  {
    id: 'sql-database-mastery',
    title: 'SQL Database Mastery',
    description: 'Master SQL queries, database design, and optimization.',
    level: 'Beginner',
    price: 42,
    duration: '9h 15m',
    students: 28940,
    rating: 4.7,
    skills: ['SQL', 'Database Design', 'MySQL', 'PostgreSQL'],
    instructor: 'Maria Garcia',
    thumbnail: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('sql', 10),
  },
  {
    id: 'git-github-mastery',
    title: 'Git & GitHub Mastery',
    description: 'Master version control and collaborative development.',
    level: 'Beginner',
    price: 35,
    duration: '6h 45m',
    students: 45670,
    rating: 4.8,
    skills: ['Git', 'GitHub', 'Version Control', 'Collaboration'],
    instructor: 'Tom Wilson',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('git', 8),
  },
  {
    id: 'javascript-es6-plus',
    title: 'Modern JavaScript (ES6+)',
    description: 'Master modern JavaScript features and best practices.',
    level: 'Intermediate',
    price: 48,
    duration: '10h 20m',
    students: 34210,
    rating: 4.7,
    skills: ['JavaScript', 'ES6', 'Async/Await', 'Modules'],
    instructor: 'Chris Johnson',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('jsmod', 11),
  },
  {
    id: 'typescript-complete',
    title: 'TypeScript Complete Course',
    description: 'Add type safety to JavaScript with TypeScript.',
    level: 'Intermediate',
    price: 52,
    duration: '11h 45m',
    students: 19870,
    rating: 4.6,
    skills: ['TypeScript', 'JavaScript', 'Type Safety', 'OOP'],
    instructor: 'Anna Smith',
    thumbnail: 'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('ts', 12),
  },
  {
    id: 'web-accessibility',
    title: 'Web Accessibility (A11y)',
    description: 'Create inclusive web experiences for all users.',
    level: 'Beginner',
    price: 38,
    duration: '7h 30m',
    students: 8760,
    rating: 4.5,
    skills: ['Accessibility', 'WCAG', 'Inclusive Design', 'Web Standards'],
    instructor: 'Accessibility Expert',
    thumbnail: 'https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('a11y', 8),
  },
  {
    id: 'performance-optimization',
    title: 'Web Performance Optimization',
    description: 'Optimize websites for speed and user experience.',
    level: 'Advanced',
    price: 68,
    duration: '13h 45m',
    students: 12340,
    rating: 4.7,
    skills: ['Performance', 'Optimization', 'Web Vitals', 'Caching'],
    instructor: 'Performance Guru',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200',
    lessons: generateLessons('perf', 14),
  }
];

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses] = useState<Course[]>(INITIAL_COURSES);

  const getRecommendedCourses = useCallback((skills: string[], learningHistory: string[]) => {
    const skillSet = new Set(skills);
    const scored = courses.map((course) => {
      const overlap = course.skills.reduce((acc, s) => acc + (skillSet.has(s) ? 1 : 0), 0);
      const trendingBoost = course.students > 10000 ? 0.5 : 0;
      const ratingBoost = (course.rating - 4.0) * 0.5; // favor higher rated
      return { course, score: overlap + trendingBoost + ratingBoost };
    });
    return scored
      .sort((a, b) => b.score - a.score)
      .map((x) => x.course);
  }, [courses]);

  const getCourseProgress = useCallback((courseId: string, userId: string): number => {
    if (!userId) return 0;
    const lessonProgressKey = `progress_${userId}_${courseId}`;
    const progressMap = JSON.parse(localStorage.getItem(lessonProgressKey) || '{}');
    const course = courses.find((c) => c.id === courseId);
    if (!course || course.lessons.length === 0) return 0;
    const completedCount = course.lessons.reduce((acc, l) => acc + (progressMap[l.id] ? 1 : 0), 0);
    return Math.round((completedCount / course.lessons.length) * 100);
  }, [courses]);

  const updateLessonProgress = useCallback((courseId: string, lessonId: string, userId: string) => {
    if (!userId) return;
    const lessonProgressKey = `progress_${userId}_${courseId}`;
    const progressMap = JSON.parse(localStorage.getItem(lessonProgressKey) || '{}');
    if (!progressMap[lessonId]) {
      progressMap[lessonId] = true;
      localStorage.setItem(lessonProgressKey, JSON.stringify(progressMap));
    }
  }, []);

  // Generate deterministic assessment questions per course
  const getAssessmentQuestions = useCallback((courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) return [];
    const baseTopics = course.lessons.map((l) => l.title);
    const skills = course.skills;
    const seed = courseId.length;
    const questions = Array.from({ length: 10 }, (_, i) => {
      const topic = baseTopics[i % baseTopics.length] || `Topic ${i + 1}`;
      const skill = skills[(i + seed) % skills.length] || 'Concept';
      const correct = (i + seed) % 4; // 0..3 deterministic
      const stem = `In the context of ${skill}, which statement about "${topic}" is most accurate?`;
      const options = [
        `A practical application of ${topic} in ${skill}.`,
        `An unrelated fact not tied to ${topic}.`,
        `A definition that partially describes ${topic}.`,
        `A common misconception about ${topic}.`
      ];
      // Ensure correct index corresponds to the most accurate choice (index 0 by default)
      // Rotate options so that index 'correct' holds the accurate one
      const accurate = options[0];
      const others = options.slice(1);
      const rotated = [accurate, ...others];
      while (rotated.indexOf(accurate) !== correct) {
        rotated.push(rotated.shift() as string);
      }
      return {
        question: stem,
        options: rotated,
        correctAnswer: correct,
      };
    });
    return questions;
  }, [courses]);

  const completeCourse = useCallback((courseId: string, userId: string) => {
    if (!userId) return;
    const key = `completed_${userId}`;
    const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (!list.includes(courseId)) {
      list.push(courseId);
      localStorage.setItem(key, JSON.stringify(list));
    }
  }, []);

  const isCourseCompleted = useCallback((courseId: string, userId: string) => {
    if (!userId) return false;
    const key = `completed_${userId}`;
    const list: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    return list.includes(courseId);
  }, []);

  const value = useMemo(() => ({
    courses,
    getRecommendedCourses,
    getCourseProgress,
    updateLessonProgress,
    getAssessmentQuestions,
    completeCourse,
    isCourseCompleted,
  }), [courses, getRecommendedCourses, getCourseProgress, updateLessonProgress, getAssessmentQuestions, completeCourse, isCourseCompleted]);

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};
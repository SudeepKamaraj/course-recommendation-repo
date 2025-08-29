const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

function requireInstructor(req, res, next) {
  if (!req.user || !['instructor', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Instructor or admin role required' });
  }
  next();
}

router.post('/', auth, requireInstructor, async (req, res) => {
  try {
    const payload = req.body;
    // If instructorName is provided, look up the user by name
    if (payload.instructorName) {
      const instructorUser = await User.findOne({
        $or: [
          { username: payload.instructorName },
          { firstName: payload.instructorName },
          { lastName: payload.instructorName }
        ]
      });
      if (!instructorUser) {
        return res.status(400).json({ message: 'Instructor not found' });
      }
      payload.instructor = instructorUser._id;
    } else {
      payload.instructor = req.user._id;
    }
    if (Array.isArray(payload.videos)) {
      payload.videos = payload.videos.map((v, i) => ({ order: i + 1, ...v }));
    }
    const course = await Course.create(payload);
    res.status(201).json(course);
  } catch (err) {
    console.error('Create course error:', err);
    res.status(500).json({ message: 'Failed to create course' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { search, category, level } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) query.$text = { $search: search };
    const courses = await Course.find(query).select('-enrolledStudents');
    res.json(courses);
  } catch (err) {
    console.error('List courses error:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
});

router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
});

router.put('/:courseId', auth, requireInstructor, async (req, res) => {
  try {
    const payload = req.body;
    const course = await Course.findByIdAndUpdate(req.params.courseId, payload, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error('Update course error:', err);
    res.status(500).json({ message: 'Failed to update course' });
  }
});

router.post('/:courseId/publish', auth, requireInstructor, async (req, res) => {
  try {
    const { isPublished } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.courseId, { isPublished: !!isPublished }, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error('Publish course error:', err);
    res.status(500).json({ message: 'Failed to change publish state' });
  }
});

router.post('/:courseId/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const idx = course.enrolledStudents.findIndex(es => es.student?.toString() === req.user._id.toString());
    if (idx === -1) {
      course.enrolledStudents.push({ student: req.user._id, progress: 0 });
      await course.save();
    }
    res.json({ enrolled: true });
  } catch (err) {
    console.error('Enroll error:', err);
    res.status(500).json({ message: 'Failed to enroll' });
  }
});

router.get('/:courseId/progress', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).select('videos enrolledStudents');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const enrollment = course.enrolledStudents.find(es => es.student?.toString() === req.user._id.toString());
    if (!enrollment) return res.json({ progress: 0, completedVideos: [] });
    res.json({ progress: enrollment.progress || 0, completedVideos: enrollment.completedVideos || [] });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ message: 'Failed to get progress' });
  }
});

router.post('/:courseId/progress/video', auth, async (req, res) => {
  try {
    const { videoId } = req.body;
    const course = await Course.findById(req.params.courseId).select('videos enrolledStudents');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const enrollment = course.enrolledStudents.find(es => es.student?.toString() === req.user._id.toString());
    if (!enrollment) return res.status(400).json({ message: 'Not enrolled' });
    if (!enrollment.completedVideos) enrollment.completedVideos = [];
    if (!enrollment.completedVideos.find(v => v.toString() === videoId)) {
      enrollment.completedVideos.push(videoId);
    }
    const total = course.videos.length || 1;
    enrollment.progress = Math.round((enrollment.completedVideos.length / total) * 100);
    await course.save();
    res.json({ progress: enrollment.progress, completedVideos: enrollment.completedVideos });
  } catch (err) {
    console.error('Mark video complete error:', err);
    res.status(500).json({ message: 'Failed to update progress' });
  }
});

module.exports = router;


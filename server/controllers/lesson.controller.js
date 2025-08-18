const Lesson = require("../models/lesson.model");
const Course = require("../models/course.model");

// Add Lesson to a Course
const addLesson = async (req, res) => {
  try {
    const { title, content, videoUrl } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson = new Lesson({ courseId, title, content, videoUrl });
    const savedLesson = await lesson.save();

    res.status(201).json({
      status: 1,
      message: "Lesson added successfully",
      data: savedLesson,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// Get all lessons of a course
const getAllLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lessons = await Lesson.find({ courseId });

    res.status(200).json({
      status: 1,
      message: "Lessons fetched successfully",
      data: lessons,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// Get one lesson
const getOneLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({
      status: 1,
      message: "Lesson fetched successfully",
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// Update lesson
const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { title, content, videoUrl } = req.body;

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { title, content, videoUrl },
      { new: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({
      status: 1,
      message: "Lesson updated successfully",
      data: updatedLesson,
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// Delete lesson
const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);

    if (!deletedLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({
      status: 1,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

module.exports = {
  addLesson,
  getAllLessons,
  getOneLesson,
  updateLesson,
  deleteLesson,
};

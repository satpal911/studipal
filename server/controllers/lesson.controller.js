const Lesson = require("../models/lesson.model");
const Course = require("../models/course.model");
// Add Lesson to a Course
const streamifier = require("streamifier");
// const Course = require("../models/course.model");
// const Lesson = require("../models/lesson.model");
const cloudinary = require("../utils/cloudinary"); 

const addLesson = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { courseId } = req.params;

    const course = await Course.findById({_id:courseId});
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Upload video to Cloudinary
    const videoUpload = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "lesson_video",
          public_id: `video${course._id}_${Date.now()}`,
           eager: [
            { width: 320, height: 180, crop: "fill", format: "jpg" } // generates thumbnail
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

    // Save lesson with Cloudinary
    const newLesson = new Lesson({
      title,
      content,
      videoUrl: videoUpload.secure_url,
      thumbnail: videoUpload.eager[0].secure_url,
      courseId: course._id
    });

    const data = await newLesson.save();

    res.status(201).json({
      status: 1,
      message: "Lesson added successfully",
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: `Server error: ${error.message}` });
  }
};

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

const getCourseLessons = async (req, res) => {
 try {
 const { courseId } = req.params;
 //lessons sorted by order
 const lessons = await Lesson.find({ courseId }).sort({ order: 1 });

 res.status(200).json({
  status: 1,
  message: "Course lessons fetched successfully for admin view",
  data: lessons,
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
  getCourseLessons,
};

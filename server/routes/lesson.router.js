const express = require("express");
// const upload = require("../middleware/uploads")
const cloudinary = require("../utils/cloudinary")
const {
  addLesson,
  getAllLessons,
  getOneLesson,
  deleteLesson,
  updateLesson,
} = require("../controllers/lesson.controller");

const mentorAuthentication = require("../middleware/auth.mentor");
const userAuthentication = require("../middleware/auth.user");
const adminAuthentication = require("../middleware/auth.admin")
const multer = require("multer");

const lessonRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({storage:storage})

//  Mentor: Add, Update, Delete
lessonRouter.post("/add-lesson/:courseId", mentorAuthentication,upload.single("videoUrl"), addLesson);
lessonRouter.put("/update-lesson/:lessonId", mentorAuthentication, updateLesson);
lessonRouter.delete("/delete-lesson/:lessonId", mentorAuthentication, deleteLesson);

// admin and Mentor sees all lessons of a course
lessonRouter.get("/mentor/get-all-lessons/:courseId", mentorAuthentication, getAllLessons);


//  User sees all lessons of a course
lessonRouter.get("/get-all-lessons/:courseId", userAuthentication, getAllLessons);
lessonRouter.get("z/get-all-lessons/:courseId", adminAuthentication, getAllLessons);

//mentor & user can see one lesson
lessonRouter.get("/get-one-lesson/:lessonId", userAuthentication, getOneLesson);

module.exports = lessonRouter;
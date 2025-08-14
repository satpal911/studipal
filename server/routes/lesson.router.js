const express = require("express")
const { addLesson, getAllLessons, getOneLesson, deleteLesson, updateLesson } = require("../controllers/lesson.controller")
const mentorAuthentication = require("../middleware/auth.mentor")

const lessonRouter = express.Router()

lessonRouter.post("/add-lesson", mentorAuthentication,addLesson)
lessonRouter.get("/get-all-lessons", mentorAuthentication,getAllLessons)
lessonRouter.get("/get-one-lesson", mentorAuthentication,getOneLesson)
lessonRouter.delete("/delete-lesson", mentorAuthentication,deleteLesson)
lessonRouter.put("/update-lesson", mentorAuthentication,updateLesson)

module.exports = lessonRouter
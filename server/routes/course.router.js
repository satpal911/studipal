const express = require("express")
const { addCourse, getAllCourses, getOneCourse, updateCourse, deleteCourse, getAllCoursesMentor } = require("../controllers/course.controller")
const mentorAuthentication = require("../middleware/auth.mentor")
const userAuthentication = require("../middleware/auth.user")

const courseRouter = express.Router()

courseRouter.post("/add-course",mentorAuthentication,addCourse)
courseRouter.get("/get-all-courses", userAuthentication,getAllCourses)
courseRouter.get("/mentor/get-all-courses", mentorAuthentication,getAllCoursesMentor)
courseRouter.get("/get-one-course/:id", mentorAuthentication,getOneCourse)
courseRouter.put("/update-course/:id", mentorAuthentication,updateCourse)
courseRouter.delete("/delete-course/:id", mentorAuthentication,deleteCourse)

module.exports = courseRouter
const express = require("express");
const { enrollCourse, getEnrolled } = require("../controllers/enroll.controller");
const userAuthentication = require("../middleware/auth.user");

const enrollRouter = express.Router();

enrollRouter.post("/:courseId", userAuthentication, enrollCourse);
enrollRouter.get("/get-enrolled", userAuthentication, getEnrolled)

module.exports = enrollRouter;

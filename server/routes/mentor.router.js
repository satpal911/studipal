const express = require("express")
const { registerMentor, loginMentor } = require("../controllers/mentor.controller")

const mentorRouter = express.Router()

mentorRouter.post("/register", registerMentor)
mentorRouter.post("/login", loginMentor)

module.exports = mentorRouter

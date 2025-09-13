const express = require("express")
const { loginMentor } = require("../controllers/mentor.controller")
const mentorAuthentication = require("../middleware/auth.mentor")

const mentorRouter = express.Router()

// mentorRouter.post("/register", registerMentor)
mentorRouter.post("/login", loginMentor)

mentorRouter.get("/me", mentorAuthentication, (req, res) => {
  res.json(req.mentor)   // 👈 send mentor details (without password)
})
module.exports = mentorRouter

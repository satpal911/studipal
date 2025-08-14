const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Mentor = require("../models/mentor.model");

// REGISTER MENTOR
const registerMentor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    const existingMentor = await Mentor.findOne({ email: emailLower });
    if (existingMentor) {
      return res.status(400).json({ status: 0, message: "Mentor already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMentor = new Mentor({ name, email: emailLower, password: hashedPassword });
    const savedMentor = await newMentor.save();

    res.status(201).json({
      status: 1,
      message: "Mentor registered successfully",
      data: { id: savedMentor._id, name: savedMentor.name, email: savedMentor.email },
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// LOGIN MENTOR
const loginMentor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    const mentor = await Mentor.findOne({ email: emailLower });
    if (!mentor) {
      return res.status(400).json({ status: 0, message: "Mentor not registered" });
    }

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) {
      return res.status(400).json({ status: 0, message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: mentor._id, role: "mentor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: 1, message: "Mentor login successful", token });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

module.exports = { registerMentor, loginMentor };

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Course = require("../models/course.model")

// REGISTER ADMIN
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email: emailLower });
    if (existingAdmin) {
      return res.status(400).json({ status: 0, message: "Admin already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ name, email: emailLower, password: hashedPassword });
    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      status: 1,
      message: "Admin registered successfully",
      data: { id: savedAdmin._id, name: savedAdmin.name, email: savedAdmin.email },
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// LOGIN ADMIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: emailLower });
    if (!admin) {
      return res.status(400).json({ status: 0, message: "Admin not registered" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ status: 0, message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: 1, message: "Admin login successful", token });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// ✅ Approve a pending course
const approveCourse = async (req, res) => {
  try {
    const { id } = req.params; // pending course ID

    const pendingCourse = await Course.findById(id);
    if (!pendingCourse || pendingCourse.status !== "pending") {
      return res.status(404).json({ status: 0, message: "Pending course not found" });
    }

    // If this is an update version
    if (pendingCourse.originalCourseId) {
      // Archive old approved course
      await Course.findByIdAndUpdate(pendingCourse.originalCourseId, { status: "archived" });
    }

    // Approve the pending course
    pendingCourse.status = "approved";
    await pendingCourse.save();

    res.status(200).json({
      status: 1,
      message: "Course approved successfully",
      data: pendingCourse
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// ❌ Reject a pending course
const rejectCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const pendingCourse = await Course.findById(id);
    if (!pendingCourse || pendingCourse.status !== "pending") {
      return res.status(404).json({ status: 0, message: "Pending course not found" });
    }

    pendingCourse.status = "rejected";
    await pendingCourse.save();

    res.status(200).json({
      status: 1,
      message: "Course rejected successfully",
      data: pendingCourse
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

module.exports = { registerAdmin, loginAdmin,approveCourse, rejectCourse };

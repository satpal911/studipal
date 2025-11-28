const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const Course = require("../models/course.model");
const Mentor = require("../models/mentor.model");
const User = require("../models/user.model");

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    const existingAdmin = await Admin.findOne({ email: emailLower });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ status: 0, message: "Admin already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      email: emailLower,
      password: hashedPassword,
    });
    const savedAdmin = await newAdmin.save();

    res.status(201).json({
      status: 1,
      message: "Admin registered successfully",
      data: {
        id: savedAdmin._id,
        name: savedAdmin.name,
        email: savedAdmin.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: `Server error: ${error.message}` });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: emailLower });
    if (!admin) {
      return res
        .status(400)
        .json({ status: 0, message: "Admin not registered" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 0, message: "Email or password is wrong" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // true ONLY in production
      sameSite: isProduction ? "None" : "Lax", // None only on HTTPS
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ status: 1, message: "Admin login successful", token });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: `Server error: ${error.message}` });
  }
};

const addMentor = async (req, res) => {
  try {
    const { name, email, password, expertise } = req.body;

    if (!name || !email || !password || !expertise) {
      return res.status(403).json({
        message: "All fields are required",
      });
    }

    const existingMentor = await Mentor.findOne({ email });

    if (existingMentor) {
      return res.status(403).json({
        message: "Mentor already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const mentor = new Mentor({
      name,
      email,
      password: hashedPassword,
      expertise,
    });

    const savedMentor = await mentor.save();

    res.status(201).json({
      status: 1,
      message: "Mentor created successfully",
      savedMentor,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: `Server error: ${error.message}`,
    });
  }
};

const approveCourse = async (req, res) => {
  try {
    const { id } = req.params; // pending course ID

    const pendingCourse = await Course.findById(id);
    if (!pendingCourse || pendingCourse.status !== "pending") {
      return res
        .status(404)
        .json({ status: 0, message: "Pending course not found" });
    }

    // If this is an update version
    if (pendingCourse.originalCourseId) {
      // Archive old approved course
      await Course.findByIdAndUpdate(pendingCourse.originalCourseId, {
        status: "archived",
      });
    }

    // Approve the pending course
    pendingCourse.status = "approved";
    await pendingCourse.save();

    res.status(200).json({
      status: 1,
      message: "Course approved successfully",
      data: pendingCourse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: `Server error: ${error.message}` });
  }
};

const rejectCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const pendingCourse = await Course.findById(id);
    if (!pendingCourse || pendingCourse.status !== "pending") {
      return res
        .status(404)
        .json({ status: 0, message: "Pending course not found" });
    }

    pendingCourse.status = "rejected";
    await pendingCourse.save();

    res.status(200).json({
      status: 1,
      message: "Course rejected successfully",
      data: pendingCourse,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: `Server error: ${error.message}` });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMentors = await Mentor.countDocuments();
    const totalPendingCourses = await Course.countDocuments({
      status: "pending",
    });
    const totalApprovedCourses = await Course.countDocuments({
      status: "approved",
    });
    const totalRejectedCourses = await Course.countDocuments({
      status: "rejected",
    });
    const totalCourses = await Course.countDocuments();

    res.status(200).json({
      status: 1,
      message: "Admin stats fetched successfully",
      data: {
        totalUsers,
        totalMentors,
        totalPendingCourses,
        totalApprovedCourses,
        totalRejectedCourses,
        totalCourses,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 0, message: `Server error: ${error.message}` });
  }
};

const getAllMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find().select("-password"); // exclude password
    res.json({
      status: 1,
      message: "All mentors fetched successfully",
      data: mentors,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Error fetching mentors",
      error: error.message,
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("mentor", "name email");
    res.json({
      status: 1,
      message: "All courses fetched successfully",
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Error fetching courses",
      error: error.message,
    });
  }
};

const deleteMentor = async (req, res) => {
  try {
    const { id } = req.params;

    const mentor = await Mentor.findByIdAndDelete(id);
    if (!mentor) {
      return res.status(404).json({ status: 0, message: "Mentor not found" });
    }

    res.status(200).json({
      status: 1,
      message: "Mentor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: `Server error: ${error.message}`,
    });
  }
};

const updateMentor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, expertise } = req.body;

    const mentor = await Mentor.findById(id);
    if (!mentor) {
      return res.status(404).json({ status: 0, message: "Mentor not found" });
    }

    mentor.name = name || mentor.name;
    mentor.email = email || mentor.email;
    mentor.expertise = expertise || mentor.expertise;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      mentor.password = hashedPassword;
    }

    await mentor.save();

    res.status(200).json({
      status: 1,
      message: "Mentor updated successfully",
      data: mentor,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: `Server error: ${error.message}`,
    });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  approveCourse,
  rejectCourse,
  addMentor,
  getAdminStats,
  getAllMentors,
  getAllCourses,
  deleteMentor,
  updateMentor,
};

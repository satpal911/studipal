const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: emailLower });
    if (existingUser) {
      return res.status(400).json({ status: 0, message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email: emailLower, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      status: 1,
      message: "User registered successfully",
      data: { id: savedUser._id, name: savedUser.name, email: savedUser.email },
    });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 0, message: "All fields are required" });
    }

    const emailLower = email.trim().toLowerCase();
    
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ status: 0, message: "User not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ status: 0, message: "Email or password is wrong" });
    }

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ status: 1, message: "User login successful", token });
  } catch (error) {
    res.status(500).json({ status: 0, message: `Server error: ${error.message}` });
  }
};

// ✅ Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ status: 0, message: "User not found" });
    }
    res.json({ status: 1, data: user });
  } catch (err) {
    res.status(500).json({ status: 0, message: "Server error" });
  }
};

// ✅ Update Name
const updateName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ status: 0, message: "Name is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select("-password");

    res.json({ status: 1, message: "Name updated successfully", data: user });
  } catch (err) {
    res.status(500).json({ status: 0, message: "Server error" });
  }
};

// ✅ Update Password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ status: 0, message: "Both old and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ status: 0, message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: 0, message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ status: 1, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ status: 0, message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateName, updatePassword};

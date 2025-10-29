const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const adminAuthentication = async (req, res, next) => {
  try {
    let token = null;

    //  Get token from cookies (browser)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // Authorization header (API / mobile)
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // No token found
    if (!token) {
      return res.status(401).json({
        status: 0,
        message: "Authentication required. Please log in.",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(403).json({
        status: 0,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    //  Find admin by ID (exclude password)
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      return res.status(401).json({
        status: 0,
        message: "Admin not found. Please log in again.",
      });
    }

    //  Attach admin to request
    req.admin = admin;

    //  Continue to next middleware
    next();
  } catch (error) {
    console.error("Admin Auth Middleware Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = adminAuthentication;

const jwt = require("jsonwebtoken");
const Mentor = require("../models/mentor.model");

const mentorAuthentication = async (req, res, next) => {
  try {
    let token = null;

    // 1️⃣ Get token from cookies (browser)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    // 2️⃣ Or from Authorization header (API / mobile)
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3️⃣ No token found
    if (!token) {
      return res.status(401).json({
        status: 0,
        message: "Authentication required. Please log in.",
      });
    }

    // 4️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(403).json({
        status: 0,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    // 5️⃣ Find mentor by ID
    const mentor = await Mentor.findById(decoded.id).select("-password");
    if (!mentor) {
      return res.status(401).json({
        status: 0,
        message: "Mentor not found. Please log in again.",
      });
    }

    // 6️⃣ Attach mentor to request
    req.mentor = mentor;

    // 7️⃣ Continue to next middleware
    next();
  } catch (error) {
    console.error("Mentor Auth Middleware Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = mentorAuthentication;

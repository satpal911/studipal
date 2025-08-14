const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const userAuthentication = async (req, res, next) => {
  try {
    let token = null;

    //Get token from cookies (browser clients)
    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    //from Authorization header (API)
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    //If no token found
    if (!token) {
      return res.status(401).json({
        status: 0,
        message: "Authentication required. Please log in.",
      });
    }

    //Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(403).json({
        status: 0,
        message: "Invalid or expired token. Please log in again.",
      });
    }

    //Find user by ID
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        status: 0,
        message: "User not found. Please log in again.",
      });
    }

    //Attach user to request
    req.user = user;

    //Continue to next middleware
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({
      status: 0,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = userAuthentication;

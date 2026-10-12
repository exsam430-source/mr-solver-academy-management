import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// Protect Route - Check Token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get Token from Header
      token = req.headers.authorization.split(" ")[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User from Token
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found ❌");
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error("User account is deactivated ❌");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed ❌");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token ❌");
  }
});

export default protect;
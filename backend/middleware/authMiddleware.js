import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

// User Authentication
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decode.userId).select("-password");
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not Authorized, Token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorized,No Auth Token ");
  }
});

// Check wether User is Admin or Not
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as Admin");
  }
};

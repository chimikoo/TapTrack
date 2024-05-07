import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../config/asyncHandler.js";
import UserModel from "../models/user.model.js";
import TimeTrack from "../models/timeTrack.model.js";
import { endShift, startShift } from "../utils/trackShifts.js";
import { clearImage } from "../utils/clearImage.js";

/* 
@desc     Register a new user
@route    POST /users/register
@access   Public
*/
const register = asyncHandler(async (req, res) => {
  const { userRole } = req;
  // Check if the user is authorized to perform this action, only admins can register new users
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
  const { username, password, firstName, lastName, email } = req.body;
  // Check if the user already exists
  const userExists = await UserModel.findOne({ username });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);
  // Create the user
  const user = await UserModel.create({
    username,
    password: hashedPassword,
    firstName,
    lastName,
    email,
  });
  // Send the response
  res.status(201).json({ message: "User registered successfully" });
});

/* 
@desc     Login a user
@route    POST /users/login
@access   Public
*/
const login = asyncHandler(async (req, res) => {
  // check if the user is already logged in
  // by the presence of a token in the request cookies
  if (req.cookies.token) {
    res.status(400);
    throw new Error("User is already logged in");
  }

  const { username, password } = req.body;
  // Check if the user exists
  const user = await UserModel.findOne({ username });
  if (!user) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
  // Check if the password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Invalid credentials");
  }
  // Create a token
  const token = jwt.sign(
    { userId: user._id, userRole: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  // Add time tracking record
  await startShift(user._id);

  // Set a cookie
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    expires: new Date(Date.now() + 9000000),
  };
  res.cookie("token", token, cookieOptions);
  // Send the response
  res.status(200).json({ message: "User logged in successfully" });
});

/* 
@desc     Logout a user
@route    GET /users/logout
@access   Private
*/
const logout = asyncHandler(async (req, res) => {
  const { userId } = req; // Assuming you have middleware to extract user ID from the request
  // Clear the cookie
  res.clearCookie("token");

  // record the end time of the last shift
  const timeTrack = await endShift(userId);

  res.status(200).json({ message: "User logged out successfully", timeTrack });
});

/* 
@desc     Force logout users who haven't logged out by end of day
*/
const forceLogoutUsers = asyncHandler(async (req, res) => {
  // get all the time track records
  const timeTracks = await TimeTrack.find();
  // loop through all the time track records
  timeTracks.forEach(async (timeTrack) => {
    await endShift(timeTrack.userId);
  });

  res.status(200).json({ message: "Users forced to logout successfully" });
});
// //
// @desc     Update user info
// @route    PATCH /users
// @access   Private
// *//
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { username, password, firstName, lastName, email } = req.body;
  const avatar = req.file.filename;
  // hash the updated password if the password is provided
  const hashedPassword = password ? await bcrypt.hash(password, 12) : password;

  // get the user's old avatar
  const user = await UserModel.findById(userId);
  const oldAvatar = user.avatar;
  if (oldAvatar) {
    // check if the path exists and the avatar is not the default avatar
    if (fs.existsSync(`./uploads/${oldAvatar}`) && oldAvatar !== "cat.png") {
      // delete the old avatar
      // fs.unlinkSync(`./uploads/${oldAvatar}`);
      clearImage(`./uploads/${oldAvatar}`);
    }
  }
  // Update the user
  await UserModel.findByIdAndUpdate(userId, {
    username,
    password: hashedPassword,
    firstName,
    lastName,
    email,
    avatar,
  });

  // Send the response
  res.status(200).json({ message: "User updated successfully" });
});

/* 
@desc     Update a user's role
@route    PATCH /users/:id
@access   Private
*/
const updateUserRole = asyncHandler(async (req, res) => {
  const { userRole } = req;
  // Check if the user is authorized to perform this action, only admins can update user roles
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
  const { id } = req.params;
  const { role } = req.body;
  // Check if the role is valid
  if (role !== "admin" && role !== "manager" && role !== "waiter") {
    res.status(400);
    throw new Error("Invalid role");
  }
  // Update the user's role
  await UserModel.findByIdAndUpdate(id, { role });
  // Send the response
  res.status(200).json({ message: "User role updated successfully" });
});

/* 
@desc     Delete a user by id
@route    DELETE /users/:id
@access   Private
*/
const deleteUser = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }

  const { id } = req.params;
  // delete the user
  await UserModel.findByIdAndDelete(id);
  // Send the response
  res.status(200).json({ message: "User deleted successfully" });
});

/* 
@desc     Get time tracking record for a user
@route    GET /users/timeTrack/:month
@access   Private
*/
const timeTrack = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { month, year } = req.query;
  // get the user's time track record
  const timeTrack = await TimeTrack.findOne({ userId });
  if (!timeTrack) {
    res.status(400);
    throw new Error("Time tracking record not found");
  }
  const filedName = `${year}-${month < 10 ? `0${month}` : month}`;
  // get the object for the given month
  const monthData = timeTrack.months.get(filedName);
  if (!monthData) {
    res.status(400);
    throw new Error("Month not found");
  }
  // send the response
  res.status(200).json({ monthData });
});

/* 
@desc     Get a list of all users
@route    GET /users
@access   Private
*/
const getUsersList = asyncHandler(async (req, res) => {
  // only admins can get the list of users
  const { userRole } = req;
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
  const users = await UserModel.find();
  if (!users || users.length === 0) {
    res.status(400);
    throw new Error("No users found");
  }
  res.status(200).json({ employees: users });
});

/* 
@desc     Get a user by id
@route    GET /users/:id
@access   Private
*/
const getUserById = asyncHandler(async (req, res) => {
  // only admins can get a user by id
  const { userRole } = req;
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  res.status(200).json({ employee: user });
});

/* 
@desc     Show user's avatar
@route    GET /users/avatar
@access   Private
*/
const showAvatar = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }
  // Check if the user has an avatar
  if (!user.avatar) {
    res.status(400);
    throw new Error("Avatar not found");
  }
  // Get the directory name of the current module
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Get the path to the user's avatar
  const picturePath = "uploads/" + user.avatar;
  const absolutePath = path.join(__dirname, "..", picturePath);
  res.sendFile(absolutePath);
});

export {
  register,
  login,
  logout,
  updateUser,
  updateUserRole,
  deleteUser,
  forceLogoutUsers,
  timeTrack,
  getUsersList,
  getUserById,
  showAvatar,
};

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../config/asyncHandler.js";
import UserModel from "../models/user.model.js";
import HourTracking from "../models/hourTracking.model.js";
import TimeTrack from "../models/timeTrack.model.js";
import { endShift, startShift } from "../utils/trackShifts.js";

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
  // Calculate end of day
  console.log("Entering the focedLogoutUsers function");
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  // Check if EoD report is being generated
  /* const isEodReportBeingGenerated = await EodModel.findOne({ timestamp: { $gt: endOfDay } });
  if (isEodReportBeingGenerated) {
    console.log("EoD report is being generated, skipping force logout");
    return;
  } */
  /*  console.log(isEodReportBeingGenerated); */
  // Find users who haven't logged out yet
  const usersToForceLogout = await HourTracking.find({
    workingHours: {
      loggedOutAt: { $exists: false },
    }, // Users who haven't logged out yet
  }).populate("userId");
  console.log(usersToForceLogout);

  // Logout each user
  for (const tracking of usersToForceLogout) {
    // Update the hour tracking record with logout time
    tracking.workingHours[tracking.workingHours.length - 1].loggedOutAt =
      new Date();
    await tracking.save();
  }
});
// //
// @desc     Update user info
// @route    PATCH /users
// @access   Private
// *//
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { username, password, firstName, lastName, email } = req.body;
  // hash the updated password if the password is provided
  const hashedPassword = password ? await bcrypt.hash(password, 12) : password;
  // Update the user
  await UserModel.findByIdAndUpdate(userId, {
    username,
    password: hashedPassword,
    firstName,
    lastName,
    email,
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
  const { month } = req.params;
  // get the user's time track record
  const timeTrack = await TimeTrack.findOne({ userId });
  if (!timeTrack) {
    res.status(400);
    throw new Error("Time tracking record not found");
  }
  // get the object for the given month
  const monthData = timeTrack.months.get(month);
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
};

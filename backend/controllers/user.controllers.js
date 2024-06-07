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
import Table from "../models/table.model.js";

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
  if (req.cookies.token) {
    res.status(200).json({ message: "User is already logged in" });
    return;
  }

  const { username, password } = req.body;

  const user = await UserModel.findOne({ username });
  if (!user) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    res.status(400).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user._id, userRole: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  await startShift(user._id);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    expires: new Date(Date.now() + 9000000),
  };
  res.cookie("token", token, cookieOptions);

  // Set user as online
  user.isOnline = true;
  await user.save();

  res.status(200).json({
    message: "User logged in successfully",
    token,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      id: user._id,
      isOnline: user.isOnline,
    },
  });
});


/* 
@desc     Logout a user
@route    GET /users/logout
@access   Private
*/
const logout = asyncHandler(async (req, res) => {
  console.log('Logging out from Server...')
  const { userId } = req;

  // Clear the cookie
  res.clearCookie("token");

  // Record the end time of the last shift
  const timeTrack = await endShift(userId);

  // Set user as offline
  const user = await UserModel.findById(userId);
  user.isOnline = false;
  await user.save();

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

/* 
@desc     Logout a specific user by ID
@route    POST /users/logout/:userId
@access   Private (Admin or Manager)
*/
const logoutUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Record the end time of the last shift
  const timeTrack = await endShift(userId);

  // Set user as offline
  const user = await UserModel.findById(userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  user.isOnline = false;
  await user.save();

  res.status(200).json({ message: "User logged out successfully", timeTrack });
});

/* 
@desc     Update user info
@route    PATCH /users
@access   Private
*/
const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { username, password, firstName, lastName, email } = req.body;
  const avatar = req.file?.filename;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 12) : password;

    const user = await UserModel.findById(userId);
    const oldAvatar = user.avatar;
    if (oldAvatar && avatar) {
      if (fs.existsSync(`./uploads/${oldAvatar}`) && oldAvatar !== "cat.png") {
        clearImage(`./uploads/${oldAvatar}`);
      }
    }

    await UserModel.findByIdAndUpdate(userId, {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      avatar: avatar || user.avatar,
    });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
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
  console.log('Request Query:', req.query); // Log the request query parameters
  const { userId } = req.query;

  if (!userId) {
    console.log('No userId provided');
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    // Get the user's time track record
    const timeTrack = await TimeTrack.findOne({ userId });
    if (!timeTrack) {
      console.log('Time tracking record not found for userId:', userId);
      res.status(400).json({ message: "Time tracking record not found" });
      return;
    }

    // Log the retrieved time track record
    console.log('Time track record found:', timeTrack);

    // Return all months' data if no specific month and year are provided
    res.status(200).json({ monthData: timeTrack.months });
  } catch (error) {
    console.error('Server error:', error); // Log server error
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});


/* 
@desc     Get time tracking record for a specific user by ID
@route    GET /users/timeTrack/user/:userId
@access   Private (Admin or Manager)
*/
const getUserTimeTrack = asyncHandler(async (req, res) => {
  const { userRole } = req;
  const { userId } = req.params;

  if (userRole !== "admin" && userRole !== "manager") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }

  if (!userId) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }

  try {
    const timeTrack = await TimeTrack.findOne({ userId });
    if (!timeTrack) {
      res.status(400).json({ message: "Time tracking record not found" });
      return;
    }

    res.status(200).json({ monthData: timeTrack.months });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

/* 
@desc     Get a list of all users
@route    GET /users
@access   Private
*/
const getUsersList = asyncHandler(async (req, res) => {
/*   // only admins can get the list of users
  const { userRole } = req;
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  } */
  const users = await UserModel.find();
  if (!users || users.length === 0) {
    res.status(400);
    throw new Error("No users found");
  }
  res.status(200).json({ employees: users });
});

/* 
@desc     Get a user by ID
@route    GET /users/info/:userId
@access   Private
*/
const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  console.log('Fetching user by ID:', userId);
  const user = await UserModel.findById(userId);
  if (!user) {
    console.log('User not found:', userId);
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.status(200).json({
    employee: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      userId: user._id,
    },
  });
});


/* 
@desc     Show user's avatar
@route    GET /users/:username/avatar
@access   Private
*/
const showAvatar = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const user = await UserModel.findOne({ username });
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  // Check if the user has an avatar
  if (!user.avatar) {
    res.status(400).json({ message: "Avatar not found" });
    return;
  }
  // Get the directory name of the current module
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  // Get the path to the user's avatar
  const picturePath = `uploads/${user.avatar}`;
  const absolutePath = path.join(__dirname, "..", picturePath);
  res.sendFile(absolutePath);
});



/* 
@desc     Get all tables
@route    GET /users/tables
@access   Private
*/
const getTables = asyncHandler(async (req, res) => {
  const tables = await Table.find();
  if (!tables || tables.length === 0) {
    res.status(400);
    throw new Error("No tables found");
  }
  res.status(200).json({ tables });
});

/* 
@desc     Get a table by number
@route    GET /users/tables/:number
@access   Private
*/
const getTableByNumber = asyncHandler(async (req, res) => {
  const { number } = req.params;
  const table = await Table.findOne({ tableNumber: number });
  if (!table) {
    res.status(400);
    throw new Error("Table not found");
  }
  res.status(200).json({ table });
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
  getUserTimeTrack,
  getUsersList,
  getUserById,
  showAvatar,
  getTables,
  getTableByNumber,
  logoutUserById,
};

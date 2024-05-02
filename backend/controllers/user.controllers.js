import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "../config/asyncHandler.js";
import UserModel from "../models/user.model.js";
import HourTracking from "../models/hourTracking.model.js";
import EodModel from "../models/eod.model.js";

/* 
@desc     Register a new user
@route    POST /users/register
@access   Public
*/
const register = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
  const { username, password, name, email } = req.body;
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
    name,
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

  // Add entry to workingHours array
  const loggedInAt = new Date();
  try {
    let hourTracking = await HourTracking.findOne({ userId: user._id });
    console.log(hourTracking);
    if (!hourTracking) {
      // Create a new HourTracking record if it doesn't exist
      hourTracking = await HourTracking.create({
        userId: user._id,
        workingHours: [{ loggedInAt }],
        /*  totalMonthlyHours: {hours: 0, minutes: 0}, */
      });
    } else {
      hourTracking.workingHours.push({ loggedInAt });
      await hourTracking.save(); // Save the user document with the updated workingHours array
    }
    console.log("HourTracking document saved:", hourTracking);
  } catch (error) {
    console.error("Error creating HourTracking document:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }

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
  // Find the user's hour tracking record
  const hourTracking = await HourTracking.findOne({ userId });
  if (!hourTracking) {
    res.status(404);
    throw new Error("Hour tracking record not found");
  }
  // Add entry to workingHours array
  const loggedOutAt = new Date();
  hourTracking.workingHours[hourTracking.workingHours.length - 1].loggedOutAt =
    loggedOutAt;
  await hourTracking.save(); // Save the user document with the updated workingHours array

  // res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
});

/* 
@desc     Calculate total hours worked in last 30 days
@route    GET /users/total-hours-worked
@access   Private
*/
const getTotalHoursWorked = async (req, res) => {
  const { userId } = req;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Calculate the date 30 days ago
  const hourTracking = await HourTracking.findOne({ userId });
  if (!hourTracking) {
    throw new Error("Hour tracking record not found");
  }
  hourTracking.totalMonthlyHours =
    hourTracking.calculateMonthlyHours(thirtyDaysAgo);
  await hourTracking.save();
  res.status(200).json({ totalHours: hourTracking.totalMonthlyHours });
};

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
// @desc     Update a user
// @route    PATCH /users/update
// @access   Private
// *//
const updateUser = asyncHandler(async (req, res) => {
  const { userRole } = req;
  if (userRole !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to perform this action");
  }
  const { id } = req.params;
  const { username, password, name, email, role } = req.body;
  // hash the updated password
  const hashedPassword = password ? await bcrypt.hash(password, 12) : password;
  // Update the user
  await UserModel.findByIdAndUpdate(id, {
    username,
    password: hashedPassword,
    name,
    email,
    role,
  });
  // Send the response
  res.status(200).json({ message: "User updated successfully" });
});

/* 
@desc     Delete a user
@route    DELETE /users/delete
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

export {
  register,
  login,
  logout,
  updateUser,
  deleteUser,
  getTotalHoursWorked,
  forceLogoutUsers,
};

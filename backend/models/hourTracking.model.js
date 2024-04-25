import { Schema, model } from "mongoose";

// Define the schema for working hours
const WorkingHoursSchema = new Schema({
  loggedInAt: {
    type: Date,
    required: true,
  },
  loggedOutAt: {
    type: Date,
    required: true,
  },
});

// Define the schema for the User model
const hourSchema = new Schema({
  // Add other fields as needed
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workingHours: [WorkingHoursSchema], // Array of working hours entries
  totalMonthlyHours: {
    type: Number,
    default: 0, // Default value of total monthly hours is set to 0
  },
});

// Define a method to calculate monthly hours for a user
hourSchema.methods.calculateMonthlyHours = function (cutoffDate) {
  let totalHours = 0;

  // Loop through each working hours entry
  for (const entry of this.workingHours) {
    // Check if the entry falls within the cutoff date range
    if (entry.loggedInAt >= cutoffDate && entry.loggedOutAt <= cutoffDate) {
      // Calculate the duration between loggedInAt and loggedOutAt in milliseconds
      const durationMs = entry.loggedOutAt - entry.loggedInAt;

      // Convert duration from milliseconds to hours
      const durationHours = durationMs / (1000 * 60 * 60);

      // Add the duration to the total hours counter
      totalHours += durationHours;
    }
  }

  // Update the totalMonthlyHours field in the schema
  this.totalMonthlyHours = totalHours;

  return totalHours;
};

// Create the User model
const HourTracking = model("workHour", hourSchema);

export default HourTracking;

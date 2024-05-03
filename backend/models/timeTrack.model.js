/* const hours = {
  [keyName]: {
    monthlyTotal: { hours: 0, minutes: 0 },
    shifts: [
      {
        start: "2024-04-01T09:00:00.000Z",
        end: "2024-04-01T17:00:00.000Z",
        total: { hours: 8, minutes: 0 },
        day: 1,
      },
    ],
  },
}; */

import { Schema, model } from "mongoose";

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const formattedMonth = month < 10 ? "0" + month : month.toString();
const keyName = `${year}-${formattedMonth}`;

const totalSchema = new Schema(
  {
    hours: {
      type: Number,
      default: 0,
    },
    minutes: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const shiftSchema = new Schema(
  {
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    total: totalSchema,
    day: {
      type: Number,
      required: true,
      default: new Date().getDate(),
    },
  },
  {
    _id: false,
  }
);

const monthlySchema = new Schema(
  {
    monthlyTotal: totalSchema,
    shifts: [shiftSchema],
  },
  {
    _id: false,
  }
);

const timeTrackSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  [keyName]: monthlySchema,
});

// Define a method to calculate daily total hours for a user
timeTrackSchema.methods.calculateDailyTotal = function (start, end) {
  let hours = 0;
  let minutes = 0;
  // Calculate the duration between start and end in milliseconds
  const durationMs = end - start;
  console.log("duration ms: ", durationMs);
  // Convert duration from milliseconds to hours
  hours = durationMs / (1000 * 60 * 60);
  console.log("hours", hours);
  // Calculate the remaining minutes
  minutes = (durationMs % (1000 * 60 * 60)) / (1000 * 60);
  console.log("minutes", minutes);

  return {
    hours: Math.floor(hours),
    minutes: Math.floor(minutes),
  };
};

// define a method to calculate monthly total hours for a user
timeTrackSchema.methods.calculateMonthlyTotal = function (keyName) {
  let hours = 0;
  let minutes = 0;
  // Loop through each shift entry
  for (let i = 0; i < this[keyName].shifts.length; i++) {
    const entry = this[keyName].shifts[i];
    hours += entry.total.hours;
    minutes += entry.total.minutes;
  }
  // Convert minutes to hours if greater than 60
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  return {
    hours,
    minutes,
  };
};

const TimeTrack = model("TimeTrack", timeTrackSchema);

export default TimeTrack;

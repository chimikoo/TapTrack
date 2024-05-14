import { Schema, model } from "mongoose";


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
  months: {
    type: Map,
    of: monthlySchema,
    default: {},
  },
});

// Define a method to calculate daily total hours for a user
timeTrackSchema.methods.calculateDailyTotal = function (start, end) {
  let hours = 0;
  let minutes = 0;
  // Calculate the duration between start and end in milliseconds
  const durationMs = end - start;
  // Convert duration from milliseconds to hours
  hours = durationMs / (1000 * 60 * 60);
  // Calculate the remaining minutes
  minutes = (durationMs % (1000 * 60 * 60)) / (1000 * 60);

  return {
    hours: Math.floor(hours),
    minutes: Math.floor(minutes),
  };
};

// define a method to calculate monthly total hours for a user
timeTrackSchema.methods.calculateMonthlyTotal = function (keyName) {
  let hours = 0;
  let minutes = 0;
  // Check if the given month exists in the map
  if (!this.months.has(keyName)) {
    throw new Error(`Month ${keyName} does not exist.`);
  }

  // Get the list of shifts for the given month
  const shifts = this.months.get(keyName).shifts;

  // Loop through each shift to calculate the total hours and minutes
  shifts.forEach((shift) => {
    hours += shift.total.hours;
    minutes += shift.total.minutes;
  });
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

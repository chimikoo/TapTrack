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

const shiftSchema = new Schema(
  {
    start: {
      type: Date,
    },
    end: {
      type: Date,
    },
    total: {
      hours: {
        type: Number,
        default: 0,
      },
      minutes: {
        type: Number,
        default: 0,
      },
    },
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

const monthlyTotalSchema = new Schema(
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

const monthlySchema = new Schema(
  {
    monthlyTotal: monthlyTotalSchema,
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

const TimeTrack = model("TimeTrack", timeTrackSchema);

export default TimeTrack;
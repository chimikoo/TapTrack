import TimeTrack from "../models/timeTrack.model.js";

const startShift = async (userId) => {
  const start = new Date();
  const keyName = start.toISOString().slice(0, 7);
  try {
    // check if the user has a time track record for the current month
    let timeTrack = await TimeTrack.findOne({ userId });
    // if not, create a new time track record
    if (!timeTrack) {
      timeTrack = new TimeTrack({
        userId,
        months: new Map(),
      });
    }

    // Ensure the current month exists in the `months` Map
    if (!timeTrack.months.has(keyName)) {
      timeTrack.months.set(keyName, {
        monthlyTotal: { hours: 0, minutes: 0 },
        shifts: [],
      });
    }

    // push the new shift to the shifts array
    timeTrack.months.get(keyName).shifts.push({
      start,
      end: null,
      total: { hours: 0, minutes: 0 },
    });
    // save the time track record
    await timeTrack.save();
  } catch (error) {
    console.log("Error: ", error);
  }
};

const endShift = async (userId) => {
  // Find the user's time tracking record
  const timeTrack = await TimeTrack.findOne({ userId });
  if (!timeTrack) {
    res.status(400);
    throw new Error("Time tracking record not found");
  }
  // create the end time
  const end = new Date();
  const keyName = end.toISOString().slice(0, 7);
  // Check if the user has any shifts
  if (timeTrack.months.get(keyName).shifts.length === 0) {
    res.status(400);
    throw new Error("No shifts found");
  }
  // Find the last shift in the current month
  const lastShift =
    timeTrack.months.get(keyName).shifts[
      timeTrack.months.get(keyName).shifts.length - 1
    ];
  // Update the end time of the last shift
  lastShift.end = end;
  // Calculate the total hours worked in the last shift
  lastShift.total = timeTrack.calculateDailyTotal(
    lastShift.start,
    lastShift.end
  );
  // update monthly total
  timeTrack.months.get(keyName).monthlyTotal =
    timeTrack.calculateMonthlyTotal(keyName);
  // Save the time track record
  await timeTrack.save();

  return timeTrack;
};

export { startShift, endShift };

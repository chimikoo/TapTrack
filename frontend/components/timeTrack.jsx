import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import axios from "axios";

const TimeTrack = () => {
  const [timeTrackData, setTimeTrackData] = useState([]);

  useEffect(() => {
    // Fetch time track data for a user
    const fetchTimeTrackData = async () => {
      setLoading(true);
      const url = `${TAP_TRACK_URL}/users/timeTrack`;
      const params = {
        params: {
          userId: id,
          month: selectedMonth,
          year: selectedYear,
        },
      };
      try {
        const { data } = await axios.get(url, params);
        setTimeTrackData(data.monthData);
      } catch (error) {
        console.error("Error fetching time track data:", error);
        setError(error.message);
      }
      setLoading(false);
    };
    fetchTimeTrackData();
  }, [id, selectedMonth, selectedYear]);

  return (
    <View>
      <Text>Time Track</Text>
      <TouchableOpacity onPress={() => console.log("Add time")}>
        <Text>Add time</Text>
      </TouchableOpacity>
      {loading && <Text>Loading...</Text>}
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      {timeTrackData && (
        <View>
          {Object.entries(timeTrackData.months).map(
            ([keyName, item], index) => (
              <View key={index}>
                <Text>{keyName}</Text>
                <Text>{item.monthlyTotal.hours}</Text>
                <Text>{item.monthlyTotal.minutes}</Text>
                <View>
                  {item.shifts.map((shift, shiftIndex) => (
                    <View key={shiftIndex}>
                      <Text>{shift.day}</Text>
                      <Text>{shift.total.hours}</Text>
                      <Text>{shift.total.minutes}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )
          )}
        </View>
      )}
    </View>
  );
};

export default TimeTrack;

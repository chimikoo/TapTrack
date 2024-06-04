import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { TAP_TRACK_URL } from "@env";

// Function to get month name from key (e.g., "2024-05")
const getMonthNameFromKey = (key) => {
  const [year, month] = key.split("-");
  const date = new Date(year, month - 1);
  const monthName = date.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};

const isCurrentMonth = (key) => {
  const [year, month] = key.split("-");
  const currentDate = new Date();
  return (
    currentDate.getFullYear() === parseInt(year) &&
    currentDate.getMonth() + 1 === parseInt(month)
  );
};

const MonthlyView = () => {
  const [timeTrackData, setTimeTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTimeTrackData = async () => {
      try {
        const storedUserData = await SecureStore.getItemAsync("userData");
        if (!storedUserData) {
          setError("User data not found");
          return;
        }
        const { id, token } = JSON.parse(storedUserData);

        if (!id) {
          setError("User ID is null");
          return;
        }

        setLoading(true);
        const url = `${TAP_TRACK_URL}/users/timeTrack`;
        const params = { userId: id };
        const headers = { Authorization: `Bearer ${token}` };
        const { data } = await axios.get(url, { params, headers });
        setTimeTrackData(data.monthData);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    };
    fetchTimeTrackData();
  }, []);

  const handlePress = (key, item) => {
    const encodedMonthData = encodeURIComponent(JSON.stringify(item));
    router.push({
      pathname: "/timeTrackDetailView",
      params: { monthKey: key, monthData: encodedMonthData },
    });
  };

  return (
    <View className="p-5 bg-primary-lighter">
      <View className="flex items-center">
        <Text className="text-2xl font-bold mb-5 text-center border-b border-gray-300 pb-2 w-[75%]">
          Time Track
        </Text>
      </View>
      {loading && <Text>Loading...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}
      {timeTrackData && Object.keys(timeTrackData).length > 0 ? (
        <ScrollView>
          {Object.entries(timeTrackData).map(([key, item], index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-lg mb-4 ${
                isCurrentMonth(key) ? "bg-secondary" : "bg-primary"
              }`}
              onPress={() => handlePress(key, item)}
            >
              <Text className="text-lg font-bold text-center">
                {getMonthNameFromKey(key)}
              </Text>
              <Text className="text-base text-center">
                Time: {item?.monthlyTotal?.hours ?? 0}h{" "}
                {item?.monthlyTotal?.minutes ?? 0}m
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text>No data available.</Text>
      )}
    </View>
  );
};

export default MonthlyView;

import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { TAP_TRACK_URL } from "@env";

const getMonthNameFromKey = (key) => {
  const [year, month] = key.split("-");
  const date = new Date(year, month - 1);
  const monthName = date.toLocaleString("default", { month: "long", year: "numeric" });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
};

const isCurrentMonth = (key) => {
  const [year, month] = key.split("-");
  const currentDate = new Date();
  return currentDate.getFullYear() === parseInt(year) && currentDate.getMonth() + 1 === parseInt(month);
};

const AdminUserTimeTrack = ({ userId, containerStyle, itemStyle }) => {
  const [timeTrackData, setTimeTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchTimeTrackData = useCallback(async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");

      if (!userId) {
        setError("User ID is null");
        return;
      }

      const url = `${TAP_TRACK_URL}/users/timeTrack/user/${userId}`;
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(url, { headers });
      setTimeTrackData(data.monthData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTimeTrackData();
  }, [fetchTimeTrackData]);

  const handlePress = (key, item) => {
    const encodedMonthData = encodeURIComponent(JSON.stringify(item));
    router.push({
      pathname: "/timeTrackDetailView",
      params: { monthKey: key, monthData: encodedMonthData },
    });
  };

  return (
    <View className={`h-full p-5 bg-primary-lighter ${containerStyle}`}>
      {loading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : timeTrackData && Object.keys(timeTrackData).length > 0 ? (
        <ScrollView>
          {Object.entries(timeTrackData).map(([key, item], index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-lg mb-4 ${isCurrentMonth(key) ? "bg-blue-400" : "bg-primary"} ${itemStyle}`}
              onPress={() => handlePress(key, item)}
            >
              <Text className="text-lg font-bold text-center">
                {getMonthNameFromKey(key)}
              </Text>
              <Text className="text-base text-center">
                Time: {item?.monthlyTotal?.hours ?? 0}h {item?.monthlyTotal?.minutes ?? 0}m
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

export default AdminUserTimeTrack;

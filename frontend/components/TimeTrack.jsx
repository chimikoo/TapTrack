import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { TAP_TRACK_URL } from "@env";
import { useTheme } from "../contexts/themeContext.jsx";

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

const TimeTrackComp = ({ containerStyle, itemStyle }) => {
  const [timeTrackData, setTimeTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const { theme, bgColor } = useTheme();

  const fetchTimeTrackData = useCallback(async () => {
    setLoading(true);
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

      const url = `${TAP_TRACK_URL}/users/timeTrack`;
      const params = { userId: id };
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await axios.get(url, { params, headers });
      setTimeTrackData(data.monthData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
    <View className={`h-full p-5 ${bgColor} ${containerStyle}`}>
      {loading ? (
        <ActivityIndicator size="large" color="#7CA982" />
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : timeTrackData && Object.keys(timeTrackData).length > 0 ? (
        <ScrollView>
          {Object.entries(timeTrackData).map(([key, item], index) => (
            <TouchableOpacity
              key={index}
              className={`p-4 rounded-lg mb-4 ${
                isCurrentMonth(key) ? "bg-tertiary" : "bg-primary"
              } ${itemStyle}`}
              onPress={() => handlePress(key, item)}
            >
              <Text className="text-lg font-bold text-center text-myWhite">
                {getMonthNameFromKey(key)}
              </Text>
              <Text className="text-base text-center text-myWhite">
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

export default TimeTrackComp;

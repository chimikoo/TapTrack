import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomButton from "../../../components/CustomButton";
import { useTheme } from "../../../contexts/themeContext.jsx";

// Function to convert date to day of the week
const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
};

// Function to merge shifts on the same day
const mergeShifts = (shifts) => {
  const mergedShifts = {};

  shifts.forEach((shift) => {
    const day = new Date(shift.start).toISOString().split("T")[0];
    if (!mergedShifts[day]) {
      mergedShifts[day] = {
        hours: 0,
        minutes: 0,
        start: shift.start,
        end: shift.end,
        earliestLogin: shift.start,
        latestLogout: shift.end,
      };
    }
    mergedShifts[day].hours += shift.total.hours;
    mergedShifts[day].minutes += shift.total.minutes;
    // Handle overflow of minutes to hours
    if (mergedShifts[day].minutes >= 60) {
      mergedShifts[day].hours += Math.floor(mergedShifts[day].minutes / 60);
      mergedShifts[day].minutes = mergedShifts[day].minutes % 60;
    }

    // Update earliest login and latest logout times
    if (new Date(shift.start) < new Date(mergedShifts[day].earliestLogin)) {
      mergedShifts[day].earliestLogin = shift.start;
    }
    if (new Date(shift.end) > new Date(mergedShifts[day].latestLogout)) {
      mergedShifts[day].latestLogout = shift.end;
    }
  });

  return Object.entries(mergedShifts).map(([day, total]) => ({
    day,
    total,
  }));
};

const DailyView = () => {
  const [firstName, setFirstName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const scrollViewRef = useRef(null);
  const params = useLocalSearchParams();
  const { monthKey, monthData } = params || {};

  const { theme, bgColor, textColor } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = await SecureStore.getItemAsync("userData");
      if (storedUserData) {
        const { firstName } = JSON.parse(storedUserData);
        setFirstName(firstName);
      }
    };
    fetchUserData();
  }, []);

  if (!monthKey || !monthData) {
    return <Text>Error: Missing parameters</Text>;
  }

  const parsedMonthData = JSON.parse(decodeURIComponent(monthData));
  const mergedShifts = mergeShifts(parsedMonthData.shifts);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const selectedDate = date.toLocaleDateString("en-CA");
    console.log("Selected Date:", selectedDate);
    console.log(
      "Merged Shifts Dates:",
      mergedShifts.map((shift) => shift.day)
    );
    const index = mergedShifts.findIndex((shift) => shift.day === selectedDate);
    console.log("Index:", index);
    if (index !== -1) {
      console.log("Scrolling to index:", index);
      scrollViewRef.current.scrollTo({ y: index * 100, animated: true });
    }
    hideDatePicker();
  };

  // Calculate the minimum and maximum dates for the current month
  const [year, month] = monthKey.split("-");
  const minDate = new Date(year, month - 1, 1);
  const maxDate = new Date(year, month, 0); // Last day of the month

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <View className="p-5 flex-1">
        <View className="flex items-center">
          <Text
            className={`text-2xl font-bold mb-5 text-center border-b border-gray-300 pb-2 w-[75%] ${textColor}`}
          >
            {firstName}'s Hour Log
          </Text>
        </View>
        {mergedShifts.length > 0 ? (
          <ScrollView ref={scrollViewRef} className="bg-grayBG">
            {mergedShifts.map((shift, index) => (
              <View key={index} className="bg-primary p-1 rounded-lg mb-3">
                <Text className="text-lg font-bold text-center text-myWhite">
                  {shift.day} - {getDayOfWeek(shift.day)}
                </Text>
                <Text className="text-base text-center pt-1 text-myWhite">
                  Time: {shift.total.hours}h {shift.total.minutes}m
                </Text>
                <View className="flex flex-column items-center p-3">
                  <Text className="text-sm text-myWhite">
                    Login:{" "}
                    {new Date(shift.total.earliestLogin).toLocaleTimeString()}
                  </Text>
                  <Text className="text-sm text-myWhite">
                    Logout:{" "}
                    {new Date(shift.total.latestLogout).toLocaleTimeString()}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>No shifts data available.</Text>
        )}
        <View className="w-full flex items-center mt-4">
          <CustomButton
            text="Pick Date"
            containerStyles="w-[50%] mt-5"
            handlePress={showDatePicker}
          />
        </View>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={minDate}
        maximumDate={maxDate}
      />
    </SafeAreaView>
  );
};

export default DailyView;

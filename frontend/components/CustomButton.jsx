import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTheme } from "../contexts/themeContext.jsx";

const CustomButton = ({ text, containerStyles, handlePress }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-primary-dark" : "bg-primary";
  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`${containerStyles} ${bgColor} py-2 rounded-lg flex justify-center items-center `}
    >
      <Text className="text-white text-lg">{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

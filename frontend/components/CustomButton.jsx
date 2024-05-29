import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = ({ text, containerStyles, handlePress }) => {
  return (
    <TouchableOpacity
    onPress={handlePress}
      className={`${containerStyles} bg-primary-dark py-2 rounded-lg flex justify-center items-center `}
    >
      <Text className="text-white text-lg">{text}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const CustomButton = () => {
  return (
    <TouchableOpacity className="bg-primary-dark w-[80%] py-2 rounded-lg flex justify-center items-center mt-4">
      <Text className="text-white text-lg">Login</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

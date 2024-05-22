import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const LoginButton = () => {
  return (
    <TouchableOpacity className="bg-[#152E2B] w-[90%] py-2 rounded-lg flex justify-center items-center mt-4">
      <Text className="text-white text-lg">Login</Text>
    </TouchableOpacity>
  );
};

export default LoginButton;

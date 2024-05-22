import { View, TextInput } from "react-native";
import React from "react";

const InputField = ({ title }) => {
  return (
    <View className="w-[90%] my-2">
      <View className="w-full h-[42px] rounded-lg border-2 border-[#152E2B] flex bg-white">
        <TextInput
          placeholder={title}
          placeholderTextColor="#8e8e8e"
          className="flex-1 text-lg text-black px-4"
          secureTextEntry={title.toLowerCase() === "password"}
        />
      </View>
    </View>
  );
};

export default InputField;

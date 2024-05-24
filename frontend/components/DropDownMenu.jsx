import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const DropDownMenu = ({ visible, onClose }) => {
  if (!visible) return null;

  const menuItems = [
    "Profile",
    "Order",
    "Settings",
    "Receipts",
    "Time Track",
    "Logout",
  ];

  return (
    <TouchableOpacity
      className="absolute top-0 left-0 right-0 bottom-0 bg-black-opacity-50 justify-center items-center z-50"
      onPress={onClose}
    >
      <View className="w-50 bg-black-opacity rounded-lg overflow-hidden">
        <View className="items-center">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`w-full p-4 ${
                index < menuItems.length ? "border-b border-gray-300" : ""
              }`}
            >
              <Text className="text-center text-white text-2xl font-bold">
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DropDownMenu;

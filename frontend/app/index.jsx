import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import InputField from "../Components/InputField.jsx";
import logo from "../assets/Images/taptrack logo 4.png";

export default function App() {
  return (
    <SafeAreaView className="h-full">
    <View className="w-full flex-1 justify-center items-center">
      <Image source={logo} resizeMode="contain" className="w-1/2" />

    </View>
  </SafeAreaView>
  );
}

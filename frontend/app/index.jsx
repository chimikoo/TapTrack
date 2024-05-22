import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";


import logo from "../assets/images/logo.png";
import InputField from "../components/InputField.jsx";
import LoginButton from "../components/LoginButton.jsx";

export default function App() {
  return (
    <SafeAreaView className="h-full bg-bgLight">
      <View className="w-full flex-1 justify-center items-center">
        <View className="w-full h-[60%] flex justify-center items-center">
          <View className="w-[75%] h-[65%] rounded-full overflow-hidden">
            <Image source={logo} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          </View>
        </View>
        <InputField title="Username" />
        <InputField title="Password" />
        <LoginButton />
      </View>
    </SafeAreaView>
  );
}


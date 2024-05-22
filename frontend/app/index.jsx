import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import logo from "../assets/images/taptrack_logo.png";
import InputField from "../components/InputField.jsx";

export default function App() {
  return (
    <SafeAreaView className="h-full">
      <View className="w-full flex-1 justify-center items-center">
        <View className="w-full h-[40%] flex justify-center items-center">
          <Image source={logo} resizeMode="contain" className="w-1/2" />
        </View>
        <InputField title="username" />
        <InputField title="password" />
      </View>
    </SafeAreaView>
  );
}

import { StatusBar } from "expo-status-bar";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import logo from "../assets/images/taptrack_logo.png";
import InputField from "../components/InputField.jsx";
import CustomButton from "../components/CustomButton.jsx";
import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({ username: "", password: "" });
  return (
    <SafeAreaView className="h-full bg-primary-lighter">
      <View className="w-full flex-1 justify-center items-center">
        <View className="w-full h-[60%] flex justify-center items-center">
          <View className="w-[75%] h-[65%] rounded-full overflow-hidden">
            <Image
              source={logo}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        </View>
        <InputField
          title="Username"
          value={form.username}
          handleChange={(e) => setForm({ ...form, username: e })}
        />
        <InputField
          title="Password"
          value={form.password}
          handleChange={(e) => setForm({ ...form, password: e })}
        />
        <CustomButton />
      </View>
    </SafeAreaView>
  );
}

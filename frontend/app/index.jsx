import { Alert, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import logo from "../assets/images/logo.png";
import InputField from "../components/InputField.jsx";
import CustomButton from "../components/CustomButton.jsx";
import { useState } from "react";
import { router } from "expo-router";
import axios from "axios";

export default function App() {
  const [form, setForm] = useState({ username: "", password: "" });

  const submit = async () => {
    // to be able to access the local host from the emulator
    // run the following command in the terminal:
    // 1. npm install -g localtunnel
    // 2. lt --port 9000 --subdomain <url-name> (port number of the backend server) -> this will give you a url
    try {
      const { data } = await axios.post(
        "https://application-server.loca.lt/users/login",
        form
      );
      console.log("data", data);
      if (data.message === "User logged in successfully") {
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
    }
  };

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
        <CustomButton
          text="Login"
          containerStyles="w-[80%] mt-4"
          handlePress={submit}
        />
      </View>
    </SafeAreaView>
  );
}

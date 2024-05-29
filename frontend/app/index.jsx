import React, { useState } from "react";
import { Alert, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import logo from "../assets/images/logo.png";
import { useNavigation } from '@react-navigation/native';
import { Link, router } from "expo-router";

// to be able to access the local host from the emulator
// run the following command in the terminal:
// 1. npm install -g localtunnel
// 2. lt --port 9000 --subdomain <url-name> (port number of the backend server) -> this will give you a url

export default function App() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigation = useNavigation();

  const logout = async () => {
    try {
      const response = await axios.get('https://application-server.loca.lt/users/logout', {
        withCredentials: true,
      });
      if (response.status === 200) {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userData");
      }
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const submit = async () => {
    try {
      const { data } = await axios.post(
        "https://application-server.loca.lt/users/login",
        form,
        { withCredentials: true }
      );

      if (data.message === "User logged in successfully") {
        const userData = {
          token: data.token,
          username: form.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
        };
        await SecureStore.setItemAsync("userToken", data.token);
        await SecureStore.setItemAsync("userData", JSON.stringify(userData));
        console.log("User data and token stored successfully");
        router.push("/(tabs)/(home)");
      } else if (data.message === "User is already logged in") {
        console.log('Entering logout')
        await logout();
        submit(); // Retry login after logging out
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      Alert.alert("Error", error.response ? error.response.data.message : error.message);
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
      <Link href="menuItemSelector">Go here</Link>
    </SafeAreaView>
  );
}

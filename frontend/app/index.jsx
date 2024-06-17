import React, { useContext, useState, useEffect } from "react";
import { Alert, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import logo from "../assets/images/logo_dark.png";
import { Link, router } from "expo-router";
import { UserContext } from "../contexts/userContext.jsx";
import { TAP_TRACK_URL } from "@env";

export default function App() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    console.log("App component mounted");
    return () => {
      console.log("App component unmounted");
    };
  }, []);

  const logout = async () => {
    console.log("Logout process started");
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (token) {
        const response = await axios.get(`${TAP_TRACK_URL}/users/logout`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (response.status === 200) {
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("userData");
          console.log("User logged out and data cleared");
        }
      } else {
        console.log("No token found, skipping logout");
      }
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Logout Error:", error);
    }
    console.log("Logout process ended");
  };

  const submit = async () => {
    console.log("Submit process started");
    try {
      const { data } = await axios.post(`${TAP_TRACK_URL}/users/login`, form, {
        withCredentials: true,
      });

      console.log("Server response received", data);

      if (
        data.message === "User logged in successfully" ||
        data.message === "User is already logged in"
      ) {
        const userData = {
          token: data.token,
          username: form.username,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
          avatar: data.user.avatar,
          id: data.user.id,
          isOnline: data.user.isOnline,
        };
        await SecureStore.setItemAsync("userToken", data.token);
        await SecureStore.setItemAsync("userData", JSON.stringify(userData));
        console.log("User data and token stored successfully");
        dispatch({ type: "LOGIN", payload: userData });
        router.push("/(tabs)/(home)");
      } else {
        Alert.alert("Login Failed", data.message);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      Alert.alert(
        "Error",
        error.response ? error.response.data.message : error.message
      );
    }
    console.log("Submit process ended");
  };

  console.log("Rendering App component");

  return (
    <SafeAreaView className="h-full bg-primary-lighter">
      <View className="w-full flex-1 justify-center items-center">
        <View className="w-full h-[60%] flex justify-center items-center">
          <View className="w-[95%] h-[65%] rounded-full overflow-hidden">
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
          handleChange={(e) => {
            console.log("Username changed:", e);
            setForm({ ...form, username: e });
          }}
          inputStyle="w-[80%]"
        />
        <InputField
          title="Password"
          value={form.password}
          handleChange={(e) => {
            console.log("Password changed:", e);
            setForm({ ...form, password: e });
          }}
          inputStyle="w-[80%]"
        />
        <CustomButton
          text="Login"
          containerStyles="w-[80%] mt-4"
          handlePress={() => {
            console.log("Login button pressed");
            submit();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

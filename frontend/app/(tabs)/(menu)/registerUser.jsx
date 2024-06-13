import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton";
import Xbutton from "../../../components/XButton";
import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { router } from "expo-router";
import { useTheme } from "../../../contexts/themeContext.jsx";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { theme, bgColor, textColor } = useTheme();

  const bgAndBorderColor =
    theme === "light"
      ? "border-primary-dark bg-myWhite"
      : "border-primary-light bg-opacGray";

  const getInputBorderColor = (input) => {
    if (input.length === 0) return "#949494";
    return input.length > 2 ? "#293B2F" : "#FF0000";
  };

  const getRoleBorderColor = () => {
    return role === "" ? "border-[#FF0000]" : "border-[#293B2F]";
  };

  const handleRegister = async () => {
    if (!username || !password || !firstName || !lastName || !email || !role) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const userData = {
      username,
      password,
      firstName,
      lastName,
      email,
      role,
    };

    setLoading(true);
    try {
      const response = await axios.post(
        `${TAP_TRACK_URL}/users/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setLoading(false);
      Alert.alert("Success", "User registered successfully");
      router.push({
        pathname: "/(tabs)/(menu)/allEmployees",
      });
    } catch (error) {
      setLoading(false);
      setError(error.message);
      Alert.alert("Error", error.message || "Failed to register user");
    }
  };

  return (
    <View className={`flex-1 px-4 pt-5 ${bgColor}`}>
      <Text className={`text-2xl font-bold text-center ${textColor}`}>
        Register New Employee
      </Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Username"
          placeholderTextColor={theme === "light" ? "#949494" : "#fefefe"}
          value={username}
          onChangeText={setUsername}
          className={`w-full p-3 rounded-lg mb-4 border ${bgAndBorderColor} ${textColor}`}
          style={{ borderColor: getInputBorderColor(username) }}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme === "light" ? "#949494" : "#fefefe"}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className={`w-full p-3 rounded-lg mb-4 border ${bgAndBorderColor} ${textColor}`}
          style={{ borderColor: getInputBorderColor(password) }}
        />
        <TextInput
          placeholder="First Name"
          placeholderTextColor={theme === "light" ? "#949494" : "#fefefe"}
          value={firstName}
          onChangeText={setFirstName}
          className={`w-full p-3 rounded-lg mb-4 border ${bgAndBorderColor} ${textColor}`}
          style={{ borderColor: getInputBorderColor(firstName) }}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor={theme === "light" ? "#949494" : "#fefefe"}
          value={lastName}
          onChangeText={setLastName}
          className={`w-full p-3 rounded-lg mb-4 border ${bgAndBorderColor} ${textColor}`}
          style={{ borderColor: getInputBorderColor(lastName) }}
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme === "light" ? "#949494" : "#fefefe"}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className={`w-full p-3 rounded-lg mb-4 border ${bgAndBorderColor} ${textColor}`}
          style={{ borderColor: getInputBorderColor(email) }}
        />
        <View
          className={`w-full rounded-lg mb-4 border ${bgAndBorderColor} ${getRoleBorderColor()}`}
        >
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue)}
          >
            <Picker.Item label="Select Role" value="" />
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Manager" value="manager" />
            <Picker.Item label="Chef" value="chef" />
            <Picker.Item label="Waiter" value="waiter" />
            <Picker.Item label="Bartender" value="bartender" />
          </Picker>
        </View>
        <CustomButton
          text={loading ? "Registering..." : "Register"}
          containerStyles="w-[75%] mt-7 bg-blue-500 p-3 rounded-lg"
          handlePress={handleRegister}
          disabled={loading}
        />
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

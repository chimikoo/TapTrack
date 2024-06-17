import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton";
import Xbutton from "../../../components/XButton";
import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { router } from "expo-router";
import { useTheme } from "../../../contexts/themeContext.jsx";
import InputField from "../../../components/InputField.jsx";

const RegisterScreen = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
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
    return form.role === "" ? "border-[#FF0000]" : "border-[#293B2F]";
  };

  const handleRegister = async () => {
    if (
      !form.username ||
      !form.password ||
      !form.role ||
      !form.email ||
      !form.firstName ||
      !form.lastName
    ) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    const userData = form;

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
      // console.log("error", error.response.data.errors);
      setErrors(error.response.data.errors);
      // Alert.alert("Error", error.message || "Failed to register user");
    }
  };

  return (
    <View className={`flex-1 px-4 pt-5 ${bgColor}`}>
      <Text className={`text-2xl font-bold text-center mt-4 ${textColor}`}>
        Register New Employee
      </Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <InputField
          title="Username"
          value={form.username}
          handleChange={(e) => {
            setForm({ ...form, username: e });
          }}
          inputStyle="w-full"
        />
        {errors.length !== 0 &&
          errors
            .filter((err) => err.username)
            .map((err, index) => (
              <Text key={index} className="text-red-500 px-4 w-full">
                - {err.username}
              </Text>
            ))}
        <InputField
          title="Password"
          value={form.password}
          handleChange={(e) => {
            setForm({ ...form, password: e });
          }}
        />
        {errors.length !== 0 &&
          errors
            .filter((err) => err.password)
            .map((err, index) => (
              <Text key={index} className="text-red-500 px-4 w-full">
                - {err.password}
              </Text>
            ))}
        <InputField
          title="First Name"
          value={form.firstName}
          handleChange={(e) => {
            setForm({ ...form, firstName: e });
          }}
        />
        {errors.length !== 0 &&
          errors
            .filter((err) => err.firstName)
            .map((err, index) => (
              <Text key={index} className="text-red-500 px-4 w-full">
                - {err.firstName}
              </Text>
            ))}
        <InputField
          title="Last Name"
          value={form.lastName}
          handleChange={(e) => {
            setForm({ ...form, lastName: e });
          }}
        />
        {errors.length !== 0 &&
          errors
            .filter((err) => err.lastName)
            .map((err, index) => (
              <Text key={index} className="text-red-500 px-4 w-full">
                - {err.lastName}
              </Text>
            ))}
        <InputField
          title="Email"
          value={form.email}
          keyboardType="email-address"
          handleChange={(e) => {
            setForm({ ...form, email: e });
          }}
        />
        {errors.length !== 0 &&
          errors
            .filter((err) => err.email)
            .map((err, index) => (
              <Text key={index} className="text-red-500 px-4 w-full">
                - {err.email}
              </Text>
            ))}
        <View
          className={`w-full h-[6vh] flex justify-center items-between rounded-lg mb-4 border ${bgAndBorderColor} ${getRoleBorderColor()}`}
        >
          <Picker
            selectedValue={form.role}
            onValueChange={(itemValue) => setForm({ ...form, role: itemValue })}
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

import React, { useState } from "react";
import { View, Text, TextInput, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CustomButton from "../../../components/CustomButton";
import Xbutton from "../../../components/XButton";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const getInputBorderColor = (input) => {
    if (input.length === 0) return "#949494";
    return input.length > 2 ? "#293B2F" : "#FF0000";
  };

  const getRoleBorderColor = () => {
    return role === "" ? "border-[#FF0000]" : "border-[#293B2F]";
  };

  return (
    <View className="flex-1 bg-primary-lighter px-4 pt-5">
      <Text className="text-2xl font-bold text-center">
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
          value={username}
          onChangeText={setUsername}
          className={`w-full p-3 bg-white rounded-lg mb-4 border`}
          style={{ borderColor: getInputBorderColor(username) }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className={`w-full p-3 bg-white rounded-lg mb-4 border`}
          style={{ borderColor: getInputBorderColor(password) }}
        />
        <TextInput
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          className={`w-full p-3 bg-white rounded-lg mb-4 border`}
          style={{ borderColor: getInputBorderColor(firstName) }}
        />
        <TextInput
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          className={`w-full p-3 bg-white rounded-lg mb-4 border`}
          style={{ borderColor: getInputBorderColor(lastName) }}
        />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          className={`w-full p-3 bg-white rounded-lg mb-4 border`}
          style={{ borderColor: getInputBorderColor(email) }}
        />
        <View
          className={`w-full bg-white rounded-lg mb-4 border ${getRoleBorderColor()}`}
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
          text="Register"
          containerStyles="w-[75%] mt-7 bg-blue-500 p-3 rounded-lg"
        />
      </ScrollView>
    </View>
  );
};

export default RegisterScreen;

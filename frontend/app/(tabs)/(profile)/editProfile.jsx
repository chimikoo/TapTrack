import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import InputField from "../../../components/InputField";
import CustomButton from "../../../components/CustomButton.jsx";
import * as SecureStore from "expo-secure-store";
import { UserContext } from "../../../contexts/userContext.jsx";
import { TAP_TRACK_URL } from "@env";
import { router } from "expo-router";

const EditProfile = () => {
  const { user, dispatch } = useContext(UserContext);
  const [firstName, setFirstName] = useState(user.firstName || "Per-Emil");
  const [lastName, setLastName] = useState(user.lastName || "Johansson");
  const [email, setEmail] = useState(user.email || "pelle@isNotAdmin.com");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState(user.avatar || "");

  const pickImage = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      Alert.alert("Error", "Permission to access media library is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Picker Result:", pickerResult);

    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      setAvatar(pickerResult.assets[0].uri);
      console.log("Avatar set to:", pickerResult.assets[0].uri);
    }
  };

  const updateUserProfile = async () => {
    console.log("Update button pressed");
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const token = await SecureStore.getItemAsync("userToken");
      console.log("Retrieved token from SecureStore:", token);

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      if (newPassword) {
        formData.append("password", newPassword);
      }
      if (avatar && avatar !== user.avatar) {
        const fileInfo = await FileSystem.getInfoAsync(avatar);
        formData.append("avatar", {
          uri: avatar,
          name: fileInfo.uri.split("/").pop(),
          type: fileInfo.mimeType || "image/jpeg",
        });
      }

      // Log each part of FormData
      formData._parts.forEach((part) => {
        console.log("FormData part:", part);
      });

      const response = await fetch(`${TAP_TRACK_URL}/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      console.log("Response received:", responseJson);

      if (response.status === 200) {
        console.log("Profile updated successfully!");
        Alert.alert("Success", "Profile updated successfully!");
        const updatedUserData = {
          ...user,
          firstName,
          lastName,
          email,
          avatar: avatar || user.avatar,
        };
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify(updatedUserData)
        );
        dispatch({ type: "UPDATE_PROFILE", payload: updatedUserData });
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
      router.push("/(tabs)/(profile)");
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        `Failed to update profile. ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter justify-center items-center pt-10">
      <Text className="text-3xl font-bold mb-6 text-center">Edit Profile</Text>
      <ScrollView className="w-full">
        <View className="w-full m-auto flex justify-center items-center pb-6">
          <Image
            source={{
              uri: `${TAP_TRACK_URL}/users/${
                user.username
              }/avatar?${Math.random()}` /* Remove math.Random when you find out how to refresh the cache */,
              headers: { Authorization: `Bearer ${user.token}` },
            }}
            className="w-40 h-40 rounded-full"
            style={{ width: 160, height: 160 }}
            onError={(e) =>
              console.log("Image Load Error:", e.nativeEvent.error)
            }
          />
          <CustomButton
            text="Choose Avatar"
            containerStyles="w-[50%] mt-4"
            handlePress={pickImage}
          />
        </View>
        <View className="flex items-center">
          <InputField
            title="First Name"
            value={firstName}
            handleChange={setFirstName}
          />
          <InputField
            title="Last Name"
            value={lastName}
            handleChange={setLastName}
          />
          <InputField title="Email" value={email} handleChange={setEmail} />
          <InputField
            title="New Password"
            value={newPassword}
            handleChange={setNewPassword}
          />
          <InputField
            title="Confirm new password"
            value={confirmPassword}
            handleChange={setConfirmPassword}
          />
          {avatar && (
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          )}
        </View>
      </ScrollView>
      <View className="w-[90%] p-4 flex items-end">
        <CustomButton
          text="Update"
          containerStyles="w-[50%] bg-blue-500 p-3 rounded-lg"
          handlePress={updateUserProfile}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

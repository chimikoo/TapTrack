import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter, useLocalSearchParams } from "expo-router";
import { TAP_TRACK_URL } from "@env";
import CustomButton from "../../../components/CustomButton";
import AdminUserTimeTrack from "../../../components/AdminUserTimeTrack"; // Import the custom time track component
import { Picker } from "@react-native-picker/picker";
import edit_icon from "../../../assets/icons/edit_icon.png";
import Xbutton from "../../../components/XButton";
import { useTheme } from "../../../contexts/themeContext.jsx";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const { theme, bgColor, textColor } = useTheme();

  useEffect(() => {
    console.log("UserId from params:", userId);
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      console.log("Retrieved token from SecureStore:", token);

      const response = await axios.get(
        `${TAP_TRACK_URL}/users/info/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("API response:", response);

      if (response.status === 200) {
        const fetchedUserData = response.data.employee;
        if (!fetchedUserData) {
          throw new Error("No employee data found in response");
        }
        setUser(fetchedUserData);
        setSelectedRole(fetchedUserData.role);
        console.log("Fetched user data:", fetchedUserData);
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert(
        "Error",
        `Failed to load user data. ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (newRole) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.patch(
        `${TAP_TRACK_URL}/users/role/${userId}`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser({ ...user, role: newRole });
        setSelectedRole(newRole);
        Alert.alert("Success", "Role updated successfully");
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      Alert.alert(
        "Error",
        `Failed to update user role. ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const deleteUser = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.delete(`${TAP_TRACK_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 200) {
        Alert.alert("Success", "User deleted successfully");
        router.push("/(tabs)/(menu)/allEmployees");
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Alert.alert(
        "Error",
        `Failed to delete user. ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const handleRoleUpdate = () => {
    updateRole(selectedRole);
    setModalVisible(false);
  };

  const handleDelete = () => {
    deleteUser();
    setDeleteModalVisible(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#7CA982" />;
  }

  return (
    <SafeAreaView className={`flex-1 justify-start items-center ${bgColor}`}>
      <ScrollView>
        <View className="w-full flex-row justify-end p-4">
          <Xbutton
            onPress={() => setDeleteModalVisible(true)}
            containerStyle="bg-red-600"
          />
        </View>
        <View className="items-center">
          {user && (
            <>
              <Image
                source={{
                  uri: `${TAP_TRACK_URL}/users/${
                    user.username
                  }/avatar?${Math.random()}`,
                  headers: { Authorization: `Bearer ${user.token}` },
                }}
                className="w-30 h-30 rounded-full"
                style={{ width: 160, height: 160 }}
              />
              <View className="items-center mt-6 w-full">
                <Text className={`text-4xl font-bold text-center ${textColor}`}>
                  {`${user.firstName} ${user.lastName}`}
                </Text>
              </View>
              <Text className="text-lg text-primary mt-4">{user.email}</Text>
              <View className="flex-row items-center mt-2">
                <Text className="text-lg text-primary">{user.role}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image source={edit_icon} className="w-6 h-6 ml-2" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
        <AdminUserTimeTrack userId={userId} />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="w-full h-full bg-black opacity-50 absolute top-0 left-0"></View>
        <View className="w-[70%] h-[200px] p-4 border border-primary-dark rounded-lg flex justify-center items-center absolute top-[40%] left-[15%] bg-myWhite">
          <Picker
            selectedValue={selectedRole}
            onValueChange={(itemValue) => setSelectedRole(itemValue)}
            style={{ width: "100%", marginBottom: 20 }}
          >
            <Picker.Item label="Admin" value="admin" />
            <Picker.Item label="Manager" value="manager" />
            <Picker.Item label="Chef" value="chef" />
            <Picker.Item label="Waiter" value="waiter" />
            <Picker.Item label="Bartender" value="bartender" />
          </Picker>
          <View className="flex-row justify-between w-full">
            <CustomButton
              text="Cancel"
              containerStyles="w-[40%]"
              handlePress={() => setModalVisible(false)}
            />
            <CustomButton
              text="Save"
              containerStyles="w-[40%]"
              handlePress={handleRoleUpdate}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View className="w-full h-full bg-black opacity-50 absolute top-0 left-0"></View>
        <View className="w-[70%] h-[200px] p-4 border border-primary-dark rounded-lg flex justify-center items-center absolute top-[40%] left-[15%] bg-myWhite">
          <Text className="text-lg mb-4">
            Are you sure you want to delete this user?
          </Text>
          <View className="flex-row justify-between w-full">
            <CustomButton
              text="Yes"
              containerStyles="w-[40%]"
              handlePress={handleDelete}
            />
            <CustomButton
              text="No"
              containerStyles="w-[40%]"
              handlePress={() => setDeleteModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminProfile;

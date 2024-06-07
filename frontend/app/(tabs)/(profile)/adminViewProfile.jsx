import React, { useCallback, useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../../../components/CustomButton";
import { UserContext } from "../../../contexts/userContext.jsx";
import { TAP_TRACK_URL } from "@env";
import TimeTrackComp from "../../../components/TimeTrack.jsx";
import edit_icon from "../../../assets/icons/edit_icon.png";
import { Picker } from "@react-native-picker/picker";
import { useRouter, useSearchParams } from "expo-router";

const AdminProfile = () => {
  const { dispatch } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const router = useRouter();
  const { userId } = useSearchParams(); // Use useSearchParams to get userId

  useEffect(() => {
    console.log("UserId from params:", userId);
    if (userId) {
      fetchUser(userId);
    }
  }, [userId]);

  const fetchUser = async (userId) => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      if (!token) {
        throw new Error("No token found in SecureStore");
      }
      console.log("Retrieved token from SecureStore:", token);

      const response = await axios.get(
        `${TAP_TRACK_URL}/users/info/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        `Failed to load user data. ${error.response?.data?.message || error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (newRole) => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.patch(
        `${TAP_TRACK_URL}/users/role/${user._id}`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        `Failed to update user role. ${error.response?.data?.message || error.message}`
      );
    }
  };

  const handleRoleUpdate = () => {
    updateRole(selectedRole);
    setModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter justify-start items-center">
      <ScrollView>
        <View className="items-center">
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            user && (
              <>
                <Image
                  source={{
                    uri: `${TAP_TRACK_URL}/users/${user.username}/avatar?${Math.random()}`,
                    headers: { Authorization: `Bearer ${user.token}` },
                  }}
                  className="w-30 h-30 rounded-full"
                  style={{ width: 160, height: 160 }}
                  onError={(e) =>
                    console.log("Image Load Error:", e.nativeEvent.error)
                  }
                />
                <View className="flex-row items-center mt-6">
                  <Text className="text-4xl font-bold">
                    {`${user.firstName} ${user.lastName}`}
                  </Text>
                </View>
                <Text className="text-lg text-gray-600 mt-4">{user.email}</Text>
                <View className="flex-row items-center mt-2">
                  <Text className="text-lg text-gray-600">{user.role}</Text>
                  <TouchableOpacity className='' onPress={() => setModalVisible(true)}>
                    <Image
                      source={edit_icon}
                      className="w-6 h-6 ml-2"
                    />
                  </TouchableOpacity>
                </View>
              </>
            )
          )}
        </View>
        <TimeTrackComp />
      </ScrollView>

      {/* Modal for role selection */}
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
    </SafeAreaView>
  );
};

export default AdminProfile;

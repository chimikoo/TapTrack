import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import Xbutton from "../../../components/XButton";
import CustomButton from "../../../components/CustomButton";
import { TAP_TRACK_URL } from "@env";
import { UserContext } from "../../../contexts/userContext.jsx";
import * as SecureStore from "expo-secure-store";

const EmployeeScreen = () => {
  const { dispatch } = useContext(UserContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchEmployees(1);
  }, []);

  const fetchEmployees = async (pageNumber) => {
    try {
      const response = await axios.get(`${TAP_TRACK_URL}/users`, {
        params: { page: pageNumber, limit: 10 },
      });
      const newEmployees = response.data.employees;

      if (newEmployees.length > 0) {
        setEmployees((prevEmployees) =>
          pageNumber === 1 ? newEmployees : [...prevEmployees, ...newEmployees]
        );
        setPage(pageNumber);
        setHasMore(newEmployees.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      Alert.alert("Error", "Failed to load employees");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreEmployees = () => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      fetchEmployees(page + 1);
    }
  };

  const getItemBackgroundColor = (isOnline) => {
    return isOnline ? "bg-primary" : "bg-myGray";
  };

  const getAvatarUrl = (username, avatar) => {
    return avatar
      ? `${TAP_TRACK_URL}/users/${username}/avatar?${Math.random()}`
      : "https://example.com/user-avatar.png";
  };

  const handleLogoutUser = async () => {
    if (!selectedUser) return;

    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.put(
        `${TAP_TRACK_URL}/users/forcedLogout/${selectedUser._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "User logged out successfully");
        // Update the employees list
        setEmployees((prevEmployees) =>
          prevEmployees.map((emp) =>
            emp._id === selectedUser._id ? { ...emp, isOnline: false } : emp
          )
        );
      } else {
        throw new Error(`Unexpected response code: ${response.status}`);
      }
    } catch (error) {
      console.error("Error logging out user:", error);
      Alert.alert(
        "Error",
        `Failed to log out user. ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setModalVisible(false);
      setSelectedUser(null);
    }
  };

  return (
    <SafeAreaView className="h-full flex-1 pt-5 bg-primary-lighter">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`flex-row items-center my-2 mx-4 rounded-lg rounded-tl-[33px] rounded-bl-[33px] ${getItemBackgroundColor(
                item.isOnline
              )}`}
              onPress={() => {
                console.log(`Navigating to profile of user: ${item._id}`);
                router.push(`/adminViewProfile?userId=${item._id}`);
              }}
            >
              <Image
                source={{ uri: getAvatarUrl(item.username, item.avatar) }}
                className="w-16 h-16 rounded-full mr-2"
              />
              <Text
                className={`flex-1 text-white pl-5 text-lg ${
                  item.isOnline ? "" : "text-primary"
                }`}
              >{`${item.firstName} ${item.lastName}`}</Text>
              {item.isOnline && item.role !== "Manager" && (
                <Xbutton
                  onPress={() => {
                    console.log(`Xbutton pressed for user: ${item._id}`);
                    setSelectedUser(item);
                    setModalVisible(true);
                  }}
                />
              )}
            </TouchableOpacity>
          )}
          onEndReached={loadMoreEmployees}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore && <ActivityIndicator size="small" color="#0000ff" />
          }
        />
      )}
      <View className="flex items-center bg-primary-lighter">
        <CustomButton
          text="Register Employee"
          containerStyles="w-[75%] mt-2 mb-2"
          handlePress={() => router.push("registerUser")}
        />
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black opacity-90">
          <View className="bg-white p-5 rounded-lg w-[80%]">
            <Text className="text-lg font-bold mb-4">Confirm Logout</Text>
            <Text className="text-base mb-4 ">
              Are you sure you want to log out {selectedUser?.firstName}{" "}
              {selectedUser?.lastName}?
            </Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                className="bg-red-500 p-3 rounded-lg w-[35%] items-center justify-center"
                onPress={handleLogoutUser}
              >
                <Text className="text-white">Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-3 rounded-lg w-[35%] items-center justify-center"
                onPress={() => setModalVisible(false)}
              >
                <Text className="text-black">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EmployeeScreen;

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
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import Xbutton from "../../../components/XButton";
import CustomButton from "../../../components/CustomButton";
import { TAP_TRACK_URL } from "@env"; // Ensure this is defined in your .env file
import { UserContext } from "../../../contexts/userContext.jsx";

const EmployeeScreen = () => {
  const { dispatch } = useContext(UserContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // Track if more data is available
  const router = useRouter();

  useEffect(() => {
    fetchEmployees(1); // Fetch the first page of employees
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
        setHasMore(newEmployees.length === 10); // Check if there might be more data
      } else {
        setHasMore(false); // No more data available
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
    return isOnline ? "bg-green-500" : "bg-red-500";
  };

  return (
    <SafeAreaView className="flex-1 mt-4 bg-primary-lighter">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={employees}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              className={`flex-row items-center p-2 my-2 mx-4 rounded-lg ${getItemBackgroundColor(item.isOnline)}`}
              onPress={() => router.push({
                pathname: "/(tabs)/(profile)/adminViewProfile",
                params: { userId: item._id },
              })}
            >
              <Image
                source={{ uri: item.avatar || "https://example.com/user-avatar.png" }}
                className="w-10 h-10 rounded-full mr-2"
              />
              <Text className="flex-1 text-white">{`${item.firstName} ${item.lastName}`}</Text>
              {item.role !== "Manager" && <Xbutton />}
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
    </SafeAreaView>
  );
};

export default EmployeeScreen;

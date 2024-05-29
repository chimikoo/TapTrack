import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const storedUserData = await SecureStore.getItemAsync("userData");
        const userData = JSON.parse(storedUserData);

        if (userData) {
          console.log("Using stored user data:", userData);
          setUser(userData);
        } else {
          const token = await SecureStore.getItemAsync("userToken");
          console.log("Retrieved token:", token);

          const response = await axios.get(
            `https://empty-frog-47.loca.lt/users/info/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const fetchedUserData = {
            token: token,
            username: response.data.employee.username,
            firstName: response.data.employee.firstName,
            lastName: response.data.employee.lastName,
            email: response.data.employee.email,
            role: response.data.employee.role,
            avatar: response.data.employee.avatar,
          };
          console.log("Fetched user data:", fetchedUserData);
          setUser(fetchedUserData);
          await SecureStore.setItemAsync(
            "userData",
            JSON.stringify(fetchedUserData)
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("Error", "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    router.push("/(tabs)/(profile)/editProfile");
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter justify-start items-center pt-16">
      <ScrollView>
        <View className="items-center">
          {user && (
            <>
              <Image
                source={{
                  uri: `https://empty-frog-47.loca.lt/users/${
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
              <Text className="text-4xl font-bold mt-6">{`${user.firstName} ${user.lastName}`}</Text>
              <Text className="text-lg text-gray-600 mt-4">{user.email}</Text>
              <Text className="text-lg text-gray-600 mt-2">{user.role}</Text>
              <CustomButton
                text="Edit Profile"
                handlePress={handleEditProfile}
                containerStyles="mt-10 px-12"
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

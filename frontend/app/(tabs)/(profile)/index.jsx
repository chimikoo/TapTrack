import React, { useCallback, useContext, useState } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";
import { UserContext } from "../../../contexts/userContext.jsx";
import { TAP_TRACK_URL } from "@env";
import { useTheme } from "../../../contexts/themeContext.jsx";

const Profile = () => {
  const { user, dispatch } = useContext(UserContext);
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("userToken");
      console.log("Retrieved token from SecureStore:", token);

      const response = await axios.get(
        `${TAP_TRACK_URL}/users/info/${user.id}`, // Use user.id instead of user._id if needed
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const fetchedUserData = {
          token: token,
          firstName: response.data.employee.firstName,
          lastName: response.data.employee.lastName,
          email: response.data.employee.email,
          role: response.data.employee.role,
          avatar: response.data.employee.avatar,
          id: response.data.employee.userId,
        };
        console.log("Fetched user data:", fetchedUserData);
        dispatch({ type: "UPDATE_PROFILE", payload: fetchedUserData });
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

  useFocusEffect(
    useCallback(() => {
      fetchUser();
    }, [])
  );

  const handleEditProfile = () => {
    router.push("/(tabs)/(profile)/editProfile");
  };

  const bgColor = theme === "light" ? "bg-primary-lighter" : "bg-primary-dark";
  const textColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";

  return (
    <SafeAreaView
      className={`flex-1 justify-start items-center pt-16 ${bgColor}`}
    >
      <ScrollView>
        <View className="items-center">
          {loading ? (
            <ActivityIndicator size="large" color="#7CA982" />
          ) : (
            user && (
              <>
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
                <Text
                  className={`text-4xl font-bold mt-6 ${textColor}`}
                >{`${user.firstName} ${user.lastName}`}</Text>
                <Text className="text-lg text-primary">{user.email}</Text>
                <Text className="text-lg text-primary">{user.role}</Text>
                <CustomButton
                  text="Edit Profile"
                  handlePress={handleEditProfile}
                  containerStyles="mt-10 px-12"
                />
              </>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

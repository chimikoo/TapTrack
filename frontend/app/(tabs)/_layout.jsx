import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import menu from "../../assets/icons/menu.png";
import home from "../../assets/icons/home.png";
import profile from "../../assets/icons/profile.png";
import arrowLeft from "../../assets/icons/arrow-left.png";
import TabIcon from "../../components/TabIcon.jsx";
import DropDownMenu from "../../components/DropDownMenu.jsx";

const TabsLayout = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    try {
      const token = await SecureStore.getItemAsync("userToken");
      const response = await axios.get('https://application-server.loca.lt/users/logout', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("userData");
        Alert.alert("Logged out successfully");
        navigation.navigate('index');
      } else {
        Alert.alert("Logout failed, please try again");
      }
    } catch (error) {
      Alert.alert("An error occurred, please try again");
    }
    setMenuVisible(false);
  };

  const handleProfile = () => {
    setMenuVisible(false);
    navigation.navigate('profile');
  };

  const handleSettings = () => {
    setMenuVisible(false);
    navigation.navigate('settings');
  };

  return (
    <>
      <SafeAreaView className="w-full h-[8vh] flex justify-center items-start px-4 mt-8 bg-primary-lighter">
        <TouchableOpacity>
          <Image
            source={arrowLeft}
            resizeMode="contain"
            className="w-10 h-10"
          />
        </TouchableOpacity>
      </SafeAreaView>
      <DropDownMenu visible={menuVisible} onClose={toggleMenu} onLogout={handleLogout} onProfile={handleProfile} onSettings={handleSettings} />
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#7CA982",
          tabBarInactiveTintColor: "#F1F7ED",
          tabBarStyle: {
            backgroundColor: "#152E2B",
            borderTopWidth: 1,
            borderTopColor: "#E0EEC6",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="menu"
          options={{
            title: "Menu",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TouchableOpacity onPress={toggleMenu}>
                <TabIcon
                  icon={menu}
                  name="Menu"
                  color={color}
                  focused={focused}
                />
              </TouchableOpacity>
            ),
          }}
          listeners={({ }) => ({
            tabPress: (e) => {
              e.preventDefault();
              toggleMenu();
            },
          })}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={home}
                name="Home"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={profile}
                name="Profile"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

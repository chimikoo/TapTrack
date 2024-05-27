import { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import menu from "../../assets/icons/menu.png";
import home from "../../assets/icons/home.png";
import profile from "../../assets/icons/profile.png";
import arrowLeft from "../../assets/icons/arrow-left.png";
import TabIcon from "../../components/TabIcon.jsx";

const DropDownMenu = ({ visible, onClose, onLogout, onProfile }) => {
  if (!visible) return null;

  const menuItems = [
    "Profile",
    "Order",
    "Settings",
    "Receipts",
    "Time Track",
    "Logout",
  ];

  return (
    <TouchableOpacity
      className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-90 justify-center items-center z-50"
      onPress={onClose}
    >
      <View className="w-50 rounded-lg overflow-hidden">
        <View className='items-center'>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`w-full p-4 ${
                index < menuItems.length - 1 ? "border-b border-gray-300" : ""
              }`}
              onPress={item === "Logout" ? onLogout : item === "Profile" ? onProfile : null}
            >
              <Text className="text-center text-white text-2xl font-bold">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const TabsLayout = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('https://application-server.loca.lt/users/logout');
      if (response.status === 200) {
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
      <DropDownMenu visible={menuVisible} onClose={toggleMenu} onLogout={handleLogout} onProfile={handleProfile} />
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

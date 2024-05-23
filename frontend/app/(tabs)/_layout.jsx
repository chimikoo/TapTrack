import { View, Text, Alert, Image } from "react-native";
import axios from "axios";
import { Tabs, router } from "expo-router";

import menu from "../../assets/icons/menu.png";
import home from "../../assets/icons/home.png";
import profile from "../../assets/icons/profile.png";
import TabIcon from "../../components/TabIcon.jsx";

const TabsLayout = () => {
  return (
    <>
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
              <TabIcon
                icon={menu}
                name="Menu"
                color={color}
                focused={focused}
              />
            ),
          }}
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

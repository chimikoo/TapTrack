import { View, Text, Alert } from "react-native";
import axios from "axios";
import { Tabs, router } from "expo-router";

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#7CA982",
          tabBarInactiveTintColor: "#A9827B",
          tabBarStyle: {
            backgroundColor: "#152E2B",
            borderTopWidth: 1,
            borderTopColor: "#E0EEC6",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{ title: "Home", headerShown: false }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;

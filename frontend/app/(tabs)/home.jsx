import { View, Text, Alert } from "react-native";
import React from "react";
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
          backgroundColor: "#F3F3F3",
          borderTopWidth: 0,
        },
      }}
      <Text>Home</Text>
    <>
  );
};

export default Home;

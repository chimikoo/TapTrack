import { useRouter } from "expo-router"; // Make sure to import useRouter
import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";
import { useTheme } from "../../../contexts/themeContext.jsx";

const AdminPanel = () => {
  const router = useRouter(); // Initialize the router

  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-primary-lighter" : "bg-primary-dark";
  const textColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";
  const btnColor = theme === "light" ? "bg-primary-dark" : "bg-primary";

  return (
    <SafeAreaView className={`flex-1 ${bgColor}`}>
      <View className="flex-1 justify-center items-center">
        <Text className={`text-3xl font-bold mb-6 ${textColor}`}>
          Admin Panel
        </Text>
        <View className="flex flex-row flex-wrap justify-center">
          {[
            {
              type: "Edit Menu",
              color: btnColor,
              iconName: "edit",
              iconType: "feather",
            },
            {
              type: "Employees",
              color: btnColor,
              iconName: "users",
              iconType: "feather",
            },
            {
              type: "Old Receipts",
              color: btnColor,
              iconName: "file-text",
              iconType: "feather",
            },
            {
              type: "Dashboard",
              color: btnColor,
              iconName: "pie-chart",
              iconType: "feather",
            },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              className={`${category.color} m-2 w-24 h-24 p-4 rounded-lg flex justify-center items-center`}
              style={{ width: "35%" }}
              onPress={() => {
                switch (category.type) {
                  case "Employees":
                    router.push("/allEmployees");
                    break;
                  case "Old Receipts":
                    router.push("/oldReceipts");
                    break;
                  case "Edit Menu":
                    router.push("/editMenu");
                    break;
                  case "Dashboard":
                    router.push("/dashboard");
                    break;
                  default:
                    console.log("Navigation not set up for this category");
                }
              }}
            >
              <Text className="text-white text-center mb-2">
                {category.type}
              </Text>
              <Icon
                name={category.iconName}
                color="#fff"
                type={category.iconType}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminPanel;

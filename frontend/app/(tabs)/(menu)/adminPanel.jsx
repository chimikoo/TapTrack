import { useRouter } from "expo-router"; // Make sure to import useRouter
import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Icon } from "@rneui/themed";

const AdminPanel = () => {
  const router = useRouter(); // Initialize the router

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter">
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl font-bold mb-6">Admin Panel</Text>
        <View className="flex flex-row flex-wrap justify-center">
          {[
            {
              type: "Edit Menu",
              color: "bg-primary-dark",
              iconName: "edit",
              iconType: "feather",
            },
            {
              type: "Employees",
              color: "bg-primary-dark",
              iconName: "users",
              iconType: "feather",
            },
            {
              type: "Old Receipts",
              color: "bg-primary-dark",
              iconName: "file-text",
              iconType: "feather",
            },
            {
              type: "Dashboard",
              color: "bg-primary-dark",
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

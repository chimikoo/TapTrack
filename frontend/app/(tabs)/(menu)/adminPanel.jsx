import { useRouter } from "expo-router"; // Make sure to import useRouter
import React from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";

const AdminPanel = () => {
  const router = useRouter(); // Initialize the router

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter">
      <View className="flex-1 justify-center items-center">
        <Text className="text-3xl font-bold mb-6">Admin Panel</Text>
        <View className="flex flex-row flex-wrap justify-center">
          {[
            { type: "All Orders", color: "bg-primary-dark" },
            { type: "Edit Menu", color: "bg-primary-dark" },
            { type: "Employees", color: "bg-primary-dark" },
            { type: "Old Receipts", color: "bg-primary-dark" },
            { type: "Dashboard", color: "bg-primary-dark" },
            { type: "Eod", color: "bg-primary-dark" },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              className={`${category.color} m-2 w-24 h-24 p-4 rounded-lg flex justify-center items-center`}
              style={{ width: "35%" }}
              onPress={() => {
                if (category.type === "Employees") {
                  router.push("/allEmployees");
                } else if (category.type === "Edit Menu") {
                  router.push("/editMenu");
                }
              }}
            >
              <Text className="text-white text-center">{category.type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AdminPanel;

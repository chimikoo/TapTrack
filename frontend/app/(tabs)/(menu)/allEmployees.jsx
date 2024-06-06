import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import Xbutton from "../../../components/XButton";
import CustomButton from "../../../components/CustomButton";

const employees = [
  { name: "Per-Emil Johansson", color: "bg-primary" },
  { name: "Luke Walsh", color: "bg-primary" },
  { name: "Fatima Badaoui", color: "bg-primary" },
  { name: "Marco Accardi", color: "bg-secondary" },
  { name: "Carlo with-a-Beard", color: "bg-primary" },
  { name: "Ezequiel Gonzalez", color: "bg-primary" },
  { name: "Franco Speziali", color: "bg-secondary" },
  { name: "AbdulHassan Mohsini", color: "bg-secondary" },
  { name: "Erik Ericsson", color: "bg-secondary" },
];

const EmployeeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 mt-4 bg-primary-lighter">
      <FlatList
        data={employees}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            className={`flex-row items-center p-2 my-2 mx-4 rounded-lg ${item.color}`}
          >
            <Image
              source={{ uri: "https://example.com/user-avatar.png" }}
              className="w-10 h-10 rounded-full mr-2"
            />
            <Text className="flex-1 text-white">{item.name}</Text>
            {item.color !== "bg-secondary" && <Xbutton />}
          </View>
        )}
      />
      <View className="flex items-center bg-primary-lighter">
      <CustomButton
          text="Register Employee"
          containerStyles="w-[75%] mt-2 mb-2"
          handlePress={() => router.push("registerUser")}
        />
      </View>
    </SafeAreaView>
  );
};

export default EmployeeScreen;

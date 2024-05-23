import { View, Text } from "react-native";
import React from "react";
import CustomButton from "../../components/CustomButton.jsx";

const Home = () => {
  const logout = async () => {
    try {
      const { data } = await axios.get(
        "https://application-server.loca.lt/users/logout"
      );
      console.log("data", data);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View>
      <Text>Home</Text>
      <CustomButton
        text="Log Out"
        containerStyles="w-[80%] mt-4"
        handlePress={logout}
      />
    </View>
  );
};

export default Home;

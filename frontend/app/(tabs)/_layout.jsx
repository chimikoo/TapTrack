import { View, Text, Alert } from "react-native";
import CustomButton from "../../components/CustomButton.jsx";
import axios from "axios";
import { router } from "expo-router";

const TabsLayout = () => {
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
      <Text>TabsLayout</Text>
      <CustomButton
        text="Log Out"
        containerStyles="w-[80%] mt-4"
        handlePress={logout}
      />
    </View>
  );
};

export default TabsLayout;

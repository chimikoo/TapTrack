import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBotton from "../../../components/CustomButton.jsx";
import MenuForm from "../../../components/MenuForm.jsx";
import { useState } from "react";

const AddMenuItem = () => {
  const [menuItem, setMenuItem] = useState({
    name: "",
    category: "starter",
    description: "",
    ingredients: "",
    price: 0,
    sizesPrices: {
      small: 0,
      medium: 0,
      large: 0,
    },
    isVegan: false,
    isLactoseFree: false,
  });

  return (
    <SafeAreaView className="bg-primary-lighter h-full">
      <View className="w-full flex items-center justify-center px-8">
        <Text className="text-primary-dark text-xl font-bold mb-4">
          Add Menu
        </Text>
        <MenuForm menuItem={menuItem} setMenuItem={setMenuItem} />
        <CustomBotton
          text="Add"
          handlePress={() => {}}
          containerStyles="w-[50%] mt-9"
        />
      </View>
    </SafeAreaView>
  );
};

export default AddMenuItem;

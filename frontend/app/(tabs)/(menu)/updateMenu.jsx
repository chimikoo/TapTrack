import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomBotton from "../../../components/CustomButton.jsx";
import MenuForm from "../../../components/MenuForm.jsx";
import { useState } from "react";

const UpdateMenu = () => {
  const [menuItem, setMenuItem] = useState({
    name: "Bruschetta",
    category: "starter",
    type: "",
    description: "some description for bruschetta",
    ingredients: "some ingredients",
    price: 15,
    sizesPrices: [
      { size: "small", price: 0 },
      { size: "medium", price: 0 },
      { size: "large", price: 0 },
    ],
    isVegan: true,
    isLactoseFree: false,
  });

  console.log("price", menuItem.price);

  return (
    <SafeAreaView className="bg-primary-lighter h-full">
      <View className="w-full flex items-center justify-center px-8">
        <Text className="text-primary-dark text-xl font-bold mb-4">
          Edit Menu
        </Text>
        <MenuForm menuItem={menuItem} setMenuItem={setMenuItem} />
        <CustomBotton
          text="Update"
          handlePress={() => {}}
          containerStyles="w-[50%] mt-9"
        />
      </View>
    </SafeAreaView>
  );
};

export default UpdateMenu;

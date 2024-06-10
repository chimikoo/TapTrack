import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton.jsx";
import MenuForm from "../../../components/MenuForm.jsx";
import { useEffect, useState } from "react";
import RestockModal from "../../../components/PaymentModal.jsx";
import { router, useLocalSearchParams } from "expo-router";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";

const UpdateMenu = () => {
  const { itemId, itemCategory } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [stock, setStock] = useState(0);
  const [menuItem, setMenuItem] = useState({
    name: "",
    category: "",
    type: "",
    description: "",
    ingredients: "",
    price: 15,
    sizesPrices: [
      { size: "small", price: 0 },
      { size: "medium", price: 0 },
      { size: "large", price: 0 },
    ],
    isVegan: true,
    isLactoseFree: false,
  });

  useEffect(() => {
    const getMenuItem = async () => {
      try {
        let url = `${TAP_TRACK_URL}/users/menu-items`;
        if (itemCategory === "beverage") {
          url += `/beverages/${itemId}`;
        } else {
          url += `/foods/${itemId}`;
        }
        const { data } = await axios.get(url);
        setMenuItem(data.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    getMenuItem();
  }, [itemId]);

  const handleRestock = async () => {
    try {
      let url = `${TAP_TRACK_URL}/users/menu-items/stock`;
      if (itemCategory === "beverage") {
        url += `/beverages/${itemId}`;
      } else {
        url += `/foods/${itemId}`;
      }
      // Send a PUT request to the server
      const { data } = await axios.put(url, { stock });
      // Show success message
      setModalVisible(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleUpdate = async () => {
    try {
      let url = `${TAP_TRACK_URL}/users/menu-items`;
      if (itemCategory === "beverage") {
        url += `/beverages/${itemId}`;
      } else {
        url += `/foods/${itemId}`;
      }
      // Send a PUT request to the server
      const { data } = await axios.put(url, menuItem);
      // Show success message
      Alert.alert("Success", "Menu item updated successfully");
      // Redirect to the menu page
      router.push("editMenu");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary-lighter h-full">
      <View className="w-full flex items-center justify-center px-8">
        <Text className="text-primary-dark text-xl font-bold mb-4">
          Edit Menu
        </Text>
        <MenuForm menuItem={menuItem} setMenuItem={setMenuItem} />
        <View className="w-full flex-row justify-between">
          <CustomButton
            text="Restock"
            handlePress={() => setModalVisible(true)}
            containerStyles="w-[40%] mt-9"
          />
          <CustomButton
            text="Update"
            handlePress={handleUpdate}
            containerStyles="w-[40%] mt-9"
          />
        </View>
      </View>
      <RestockModal
        text="Restock"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        amount={stock}
        handleAmount={setStock}
        handleConfirm={handleRestock}
      />
    </SafeAreaView>
  );
};

export default UpdateMenu;

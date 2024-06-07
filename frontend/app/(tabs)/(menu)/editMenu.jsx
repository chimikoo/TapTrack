import { View, Text, SafeAreaView, ScrollView } from "react-native";
import Filters from "../../../components/Filters";
import Xbutton from "../../../components/XButton.jsx";
import EditButton from "../../../components/EditButton.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import DeleteModal from "../../../components/DeleteModal.jsx";
import { useState } from "react";

const mainDishes = [
  "Burger",
  "Pizza",
  "Pasta",
  "Salad",
  "Soup",
  "Sandwich",
  "Taco",
  "Burrito",
  "Hot Dog",
  "Sushi",
  "Ramen",
  "Curry",
  "Stir Fry",
  "Fried Rice",
  "Noodles",
  "Kebab",
  "Shawarma",
  "Tandoori",
];

const EditMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {};

  return (
    <SafeAreaView className="bg-primary-lighter h-full w-full p-8 flex justify-center items-center">
      <Filters />
      <Text className="text-xl font-bold text-primary-dark">Main</Text>
      <ScrollView className="w-full">
        {mainDishes.map((dish) => (
          <View className="border-b mb-4 flex-row justify-between items-center">
            <Text className="text-xl m-2">{dish}</Text>
            <View className="w-[25%] flex-row items-center justify-between">
              <EditButton />
              <Xbutton handlePress={() => setModalVisible(true)} />
            </View>
          </View>
        ))}
      </ScrollView>
      <CustomButton
        text="Add Dish"
        containerStyles="w-[50%] mt-6"
        handlePress={() => {}}
      />
      <DeleteModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleDelete={handleDelete}
      />
    </SafeAreaView>
  );
};

export default EditMenu;

import { View, Text, SafeAreaView, ScrollView, Alert } from "react-native";
import Filters from "../../../components/Filters";
import Xbutton from "../../../components/XButton.jsx";
import EditButton from "../../../components/EditButton.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import DeleteModal from "../../../components/DeleteModal.jsx";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useMenu } from "../../../contexts/menuContext.jsx";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";

const EditMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { menuItems } = useMenu();
  const [menuSelected, setMenuSelected] = useState(menuItems.foods);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("starter"); // default category
  const [sortBy, setSortBy] = useState("");
  const [limit, setLimit] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const handleDelete = async () => {
    try {
      let url = `${TAP_TRACK_URL}/users/menu-items`;
      if (category === "beverage") {
        url += `/beverages/${deleteId}`;
      } else {
        url += `/foods/${deleteId}`;
      }
      await axios.delete(url);
      Alert.alert("Success", "Item deleted successfully");
      setModalVisible(false);
    } catch (error) {}
  };

  const handleFilter = () => {
    let filteredMenu = menuItems.foods.concat(menuItems.beverages);
    if (name) {
      // filter menu items by name not caring if it is upper or lower case
      filteredMenu = filteredMenu.filter((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    if (price) {
      filteredMenu = filteredMenu.filter((item) => item.price <= price);
    }
    if (category) {
      filteredMenu = filteredMenu.filter((item) => item.category === category);
    }
    if (sortBy) {
      filteredMenu.sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortBy === "price") {
          return a.price - b.price;
        } else {
          return a.category.localeCompare(b.category);
        }
      });
    }
    if (limit) {
      filteredMenu = filteredMenu.slice(0, limit);
    }
    setMenuSelected(filteredMenu);
  };

  return (
    <SafeAreaView className="bg-primary-lighter h-full w-full p-8 flex justify-center items-center">
      <Filters
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
        limit={limit}
        setLimit={setLimit}
        handleFilter={handleFilter}
      />
      {/* <Text className="text-xl font-bold text-primary-dark">{category}</Text> */}
      <ScrollView className="w-full mt-4">
        {menuSelected.map((dish, index) => {
          const outOfStock = dish.stock === 0 ? "text-secondary" : "";
          return (
            <View
              key={index}
              className="border-b mb-4 flex-row justify-between items-center"
            >
              <Text className={`${outOfStock} text-lg m-2`}>{dish.name}</Text>
              <View className="w-[25%] flex-row items-center justify-between">
                <EditButton
                  handleEdit={() => {
                    router.push({
                      pathname: "updateMenu",
                      params: { itemId: dish._id, itemCategory: dish.category },
                    });
                  }}
                />
                <Xbutton
                  onPress={() => {
                    setModalVisible(true);
                    setDeleteId(dish._id);
                  }}
                  containerStyle="bg-secondary"
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
      <CustomButton
        text="Add Item"
        containerStyles="w-[50%] mt-6 -mb-3"
        handlePress={() => {
          router.push("addMenuItem");
        }}
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

import {
  Text,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Filters from "../../../components/Filters";
import Xbutton from "../../../components/XButton.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import DeleteModal from "../../../components/DeleteModal.jsx";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useMenu } from "../../../contexts/menuContext.jsx";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";
import { useTheme } from "../../../contexts/themeContext.jsx";

const EditMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { menuItems, fetchMenuItems } = useMenu();
  const [menuSelected, setMenuSelected] = useState(menuItems.foods);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("starter"); // default category
  const [sortBy, setSortBy] = useState("");
  const [limit, setLimit] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const { theme, bgColor, textColor } = useTheme();

  useEffect(() => {
    setMenuSelected(menuItems.foods);
  }, [menuItems]);

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
      fetchMenuItems(); // fetch menu items again to update the list
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
    // Reset filters
    setName("");
    setPrice("");
    setLimit("");
  };

  return (
    <SafeAreaView
      className={`${bgColor} h-full w-full p-8 flex justify-center items-center`}
    >
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

      <FlatList
        className="w-full mt-4"
        data={menuSelected}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const outOfStock = item.stock === 0 ? "text-secondary" : "";
          return (
            <TouchableOpacity
              className={`border-b mb-4 flex-row justify-between items-center ${
                theme === "dark" ? "border-primary-lighter" : "border-gray-700"
              }`}
              onPress={() => {
                router.push({
                  pathname: "updateMenu",
                  params: { itemId: item._id, itemCategory: item.category },
                });
              }}
            >
              <Text className={`${outOfStock} ${textColor} text-lg m-2`}>
                {item.name}
              </Text>
              <Xbutton
                onPress={() => {
                  setModalVisible(true);
                  setDeleteId(item._id);
                }}
                containerStyle="bg-red-600"
              />
            </TouchableOpacity>
          );
        }}
      />

      <CustomButton
        text="Add Item"
        containerStyles="w-[50%] mt-6 -mb-3"
        handlePress={() => {
          router.push({
            pathname: "addMenuItem",
          });
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

import { View, Text, SafeAreaView, ScrollView } from "react-native";
import Filters from "../../../components/Filters";
import Xbutton from "../../../components/XButton.jsx";
import EditButton from "../../../components/EditButton.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import DeleteModal from "../../../components/DeleteModal.jsx";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useMenu } from "../../../contexts/menuContext.jsx";

const EditMenu = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { menuItems, loading } = useMenu();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("starter"); // default category
  const [sortBy, setSortBy] = useState("");
  const [limit, setLimit] = useState("");

  useEffect(() => {
    // filter menu items based on the filters

  }, [name, price, category, sortBy, limit]);

  const handleDelete = () => {};

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
      />
      {/* <Text className="text-xl font-bold text-primary-dark">{category}</Text> */}
      <ScrollView className="w-full mt-4">
        {(category === "beverage"
          ? menuItems.beverages
          : menuItems.foods.filter((item) => item.category === category)
        ).map((dish, index) => {
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
                  onPress={() => setModalVisible(true)}
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

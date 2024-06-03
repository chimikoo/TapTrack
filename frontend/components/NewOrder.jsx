import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text, TouchableOpacity, Image, Button } from "react-native";
import axios from "axios";

const FoodItem = ({ item, onAdd }) => {
  return (
    <View className="bg-gray-200 w-[20vh] h-[16vh] flex justify-center items-center mb-4 mr-4 ml-4 rounded-lg">
      <Image
        source={{ uri: item.image }}
        resizeMode="contain"
        className="w-1/2 h-1/2"
      />
      <Text className="text-lg">{item.name}</Text>
      <TouchableOpacity
        className="bg-primary p-2 rounded"
        onPress={() => onAdd(item)}
      >
        <Text className="text-white">Add</Text>
      </TouchableOpacity>
    </View>
  );
};

const OrderScreen = ({ route, navigation }) => {
  const { tableNumber } = route.params;
  const [order, setOrder] = useState({
    userId: "someUserId", // This should be dynamically set based on your application's logic
    tableNumber, // Set the table number from navigation params
    drinks: [],
    starter: [],
    main: [],
    side: [],
    dessert: [],
    extras: [],
  });
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const { data } = await axios.get(
          "https://application-server.loca.lt/food/items"
        );
        setFoodItems(data.foodItems);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };

    fetchFoodItems();
  }, []);

  const addToOrder = (item) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };

      if (item.category === "drink") {
        newOrder.drinks.push({
          quantity: 1,
          size: "medium",
          drinkItem: item._id,
        });
      } else if (item.category === "starter") {
        newOrder.starter.push({ quantity: 1, dishItem: item._id });
      } else if (item.category === "main") {
        newOrder.main.push({ quantity: 1, dishItem: item._id });
      } else if (item.category === "side") {
        newOrder.side.push({ quantity: 1, dishItem: item._id });
      } else if (item.category === "dessert") {
        newOrder.dessert.push({ quantity: 1, dishItem: item._id });
      } else if (item.category === "extra") {
        newOrder.extras.push(item._id);
      }

      return newOrder;
    });
  };

  const submitOrder = async () => {
    try {
      const response = await axios.post(
        "https://application-server.loca.lt/orders",
        order
      );
      console.log("Order submitted:", response.data);
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting order:", error);
    }
  };

  const orderSummary = order.drinks
    .concat(order.starter, order.main, order.side, order.dessert)
    .reduce((summary, item) => {
      if (summary[item.dishItem || item.drinkItem]) {
        summary[item.dishItem || item.drinkItem]++;
      } else {
        summary[item.dishItem || item.drinkItem] = 1;
      }
      return summary;
    }, {});

  return (
    <View className="flex-1 p-4">
      <View className="flex flex-wrap justify-center">
        {foodItems.map((item) => (
          <FoodItem key={item._id} item={item} onAdd={addToOrder} />
        ))}
      </View>
      <View className="bg-white p-4 rounded-lg mt-4">
        <Text className="text-xl mb-2">Order Summary</Text>
        {Object.keys(orderSummary).length === 0 ? (
          <Text>No items in the order.</Text>
        ) : (
          Object.keys(orderSummary).map((itemId) => (
            <Text key={itemId} className="text-lg">
              {itemId}: {orderSummary[itemId]}
            </Text>
          ))
        )}
        <Button title="Submit Order" onPress={submitOrder} />
      </View>
    </View>
  );
};

export default OrderScreen;

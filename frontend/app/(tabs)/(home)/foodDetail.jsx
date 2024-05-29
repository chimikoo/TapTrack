import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AddRemove from "../../../components/AddRemove.jsx";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton.jsx";

const FoodDetail = () => {
  const [quantity, setQuantity] = useState(0);
  const [extra, setExtra] = useState("");
  const [price, setPrice] = useState("");
  const [extras, setExtras] = useState([]);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 0 ? quantity - 1 : 0);

  const addItem = () => {
    // Add item logic here
  };

  const addToOrder = () => {
    // Add to order logic here
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter items-center px-4 pb-4">
      <ScrollView className="w-full bg-gray-200 rounded-lg p-4">
        <View className="flex-row w-full justify-between items-center">
          <Text className="text-2xl font-bold">Bruschetta</Text>
          <AddRemove
            quantity={quantity}
            handleDecrement={decrementQuantity}
            handleIncrement={incrementQuantity}
          />
        </View>
        <View className="mt-5">
          <Text className="text-base font-bold text-primary-dark">
            Description:
          </Text>
          <Text className="pl-4 text-primary-dark">
            Some Description ......
          </Text>
          <Text className="mt-3 text-base font-bold text-primary-dark">
            Ingredients:
          </Text>
          <Text className="pl-4 text-primary-dark">
            Tomato, Basil, Olive Oil, Garlic, Bread
          </Text>

          <View className="flex flex-row gap-4 mt-2">
            <Text className="font-bold text-primary-dark">is vegan?</Text>
            <Text>Yes</Text>
          </View>
          <View className="flex flex-row gap-4">
            <Text className="font-bold text-primary-dark">
              is lactose free?
            </Text>
            <Text>No</Text>
          </View>

          <Text className="text-base font-bold mt-4 text-primary-dark">
            Extra:
          </Text>
          <View className="flex gap-1">
            {extras.map((extra, index) => (
              <View className="flex-row items-center justify-between">
                <Text>
                  {index + 1}. {extra.extra}
                </Text>
                <Text>{extra.price}€</Text>
              </View>
            ))}
          </View>

          <View className="flex-row mt-4">
            <TextInput
              placeholder="extra"
              value={extra}
              onChangeText={setExtra}
              className="bg-myWhite border border-gray-400 flex-1 p-2 rounded"
            />
            <TextInput
              placeholder="price"
              value={price}
              onChangeText={setPrice}
              className="bg-myWhite border border-gray-400 flex-1 p-2 rounded mx-2"
            />
            <CustomButton
              text="Add"
              containerStyles="bg-primary-dark text-white px-4 rounded"
              handlePress={() => {
                setExtras([...extras, { extra, price }]);
                // RESET INPUTS
                setExtra("");
                setPrice("");
              }}
            />
          </View>
        </View>
      </ScrollView>
      <CustomButton
        text="Add to Order"
        handlePress={addToOrder}
        containerStyles="w-full mt-4"
      />
    </SafeAreaView>
  );
};

export default FoodDetail;

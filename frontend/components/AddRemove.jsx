import { View, Text, TouchableOpacity } from "react-native";

const AddRemove = ({ quantity, handleDecrement, handleIncrement }) => {
  return (
    <View className="w-[30%] flex flex-row justify-between items-center">
      <TouchableOpacity
        className="w-8 h-8 flex justify-center items-center bg-primary-dark rounded"
        onPress={handleDecrement}
      >
        <Text className="text-xl text-white -mt-1">-</Text>
      </TouchableOpacity>
      <Text className="mx-2">{quantity}</Text>
      <TouchableOpacity
        className="w-8 h-8 flex justify-center items-center bg-primary-dark rounded"
        onPress={handleIncrement}
      >
        <Text className="text-xl text-white -mt-1">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddRemove;

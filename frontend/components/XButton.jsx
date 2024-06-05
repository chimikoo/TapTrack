import { View, Text, TouchableOpacity } from "react-native";

const Xbutton = () => {
  return (
    <View className="flex flex-row justify-between items-center mr-2">
      <TouchableOpacity
        className="w-6 h-6 flex justify-center items-center bg-primary-dark rounded"
      >
        <Text className="text-[] text-white -mt-[2px]">X</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Xbutton;

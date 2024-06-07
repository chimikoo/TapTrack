import { View, Text, TouchableOpacity } from "react-native";

const Xbutton = ({ handlePress }) => {
  return (
    <View className="flex flex-row justify-between items-center mr-2">
      <TouchableOpacity
        onPress={handlePress}
        className="w-6 h-6 flex justify-center items-center bg-secondary rounded"
      >
        <Text className="text-[] text-white -mt-[2px]">X</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Xbutton;

import { View, Text, TouchableOpacity } from "react-native";

const Xbutton = ({ onPress, containerStyle = "bg-primary-dark" }) => {
  return (
    <View className="flex flex-row justify-between items-center mr-2">
      <TouchableOpacity
        className={`w-6 h-6 flex justify-center items-center rounded ${containerStyle}`}
        onPress={onPress}
      >
        <Text className="text-[] text-white -mt-[2px]">X</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Xbutton;

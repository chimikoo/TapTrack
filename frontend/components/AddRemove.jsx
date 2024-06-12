import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/themeContext.jsx";

const AddRemove = ({ quantity, handleDecrement, handleIncrement }) => {
  const { theme } = useTheme();
  const bgColor = theme === "light" ? "bg-primary-dark" : "bg-primary-light";
  const textColor =
    theme === "light" ? "text-primary-lighter" : "text-primary-dark";
  const quantityColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";
  return (
    <View className="w-[30%] flex flex-row justify-between items-center">
      <TouchableOpacity
        className={`w-8 h-8 flex justify-center items-center rounded ${bgColor}`}
        onPress={handleDecrement}
      >
        <Text className={`text-xl -mt-1 ${textColor}`}>-</Text>
      </TouchableOpacity>
      <Text className={`mx-2 ${quantityColor}`}>{quantity}</Text>
      <TouchableOpacity
        className={`w-8 h-8 flex justify-center items-center rounded ${bgColor}`}
        onPress={handleIncrement}
      >
        <Text className={`text-xl -mt-1 ${textColor}`}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddRemove;

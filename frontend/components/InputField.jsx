import { View, Text, TextInput } from "react-native";

const InputField = ({title}) => {
  return (
    <View className="space-y-2 w-[80%] py-3">
      <View className="w-full h-16 px-4 rounded-2xl border-2 border-blue-200 flex flex-row items-center">
        <TextInput
            value=""
            placeholder={title}
            placeholderTextColor="#8e8e8e"
        />
      </View>
    </View>
  );
};

export default InputField;

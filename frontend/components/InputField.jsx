import { useState } from "react";
import { View, TextInput, TouchableOpacity, Image } from "react-native";
import eye from "../assets/icons/eye.png";
import eyeHide from "../assets/icons/eye-hide.png";
import { useTheme } from "../contexts/themeContext.jsx";

const InputField = ({
  title,
  value,
  handleChange,
  keyboardType = "default",
  inputStyle = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { theme, textColor } = useTheme();

  const bgColor =
    theme === "light"
      ? "border-primary-dark bg-myWhite"
      : "border-primary-light bg-opacGray";

  return (
    <View className={`space-y-2 py-2 ${inputStyle}`}>
      <View
        className={`w-full h-[6vh] px-4 rounded-lg flex flex-row items-center justify-between border ${bgColor}`}
      >
        <TextInput
          value={value}
          placeholder={title}
          placeholderTextColor="#8e8e8e"
          keyboardType={keyboardType}
          secureTextEntry={
            (title === "Password" ||
              title === "New Password" ||
              title === "Confirm new password") &&
            !showPassword
          }
          onChangeText={handleChange}
          className={`flex-1 ${textColor}`}
        />
        {(title === "Password" ||
          title === "New Password" ||
          title === "Confirm new password") && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={showPassword ? eyeHide : eye}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default InputField;

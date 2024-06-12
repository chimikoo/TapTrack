import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import noFileFound from "../assets/icons/no-file-found.png";
import { useTheme } from "../contexts/themeContext.jsx";

const NotFound = ({ text }) => {
  const { theme } = useTheme();
  const textColor =
    theme === "light" ? "text-primary-dark" : "text-primary-lighter";
  const bgColor = theme === "light" ? "bg-primary-lighter" : "bg-primary-dark";
  return (
    <SafeAreaView
      className={`h-full flex justify-start items-center pt-6 ${bgColor}`}
    >
      <Image source={noFileFound} className="w-1/2" resizeMode="contain" />
      <Text className={`text-2xl font-bold mt-6 ${textColor}`}>Oops...</Text>
      <Text className={`text-2xl font-bold ${textColor}`}>{text}</Text>
    </SafeAreaView>
  );
};

export default NotFound;

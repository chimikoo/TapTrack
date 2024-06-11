import { Image, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import noFileFound from "../assets/icons/no-file-found.png";

const NotFound = ({ text }) => {
  return (
    <SafeAreaView className="h-full flex justify-start items-center bg-primary-lighter pt-6">
      <Image source={noFileFound} className="w-1/2" resizeMode="contain" />
      <Text className="text-2xl font-bold text-primary-dark mt-6">Oops...</Text>
      <Text className="text-2xl font-bold text-primary-dark">{text}</Text>
    </SafeAreaView>
  );
};

export default NotFound;

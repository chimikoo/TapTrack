import { TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import arrowLeft from "../assets/icons/arrow-left.png";

const Header = ({ handleBack }) => {
  return (
    <SafeAreaView className="w-full h-[8vh] flex justify-center items-start px-4 mt-8 bg-primary-lighter">
      <TouchableOpacity onPress={handleBack}>
        <Image source={arrowLeft} resizeMode="contain" className="w-10 h-10" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Header;

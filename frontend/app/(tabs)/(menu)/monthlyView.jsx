import { SafeAreaView } from "react-native-safe-area-context";
import TimeTrackComp from "../../../components/TimeTrack";
import { View, Text } from "react-native";
import { useTheme } from "../../../contexts/themeContext.jsx";

const monthlyView = () => {
  const { theme, bgColor, textColor } = useTheme();
  
  return (
    <>
      <SafeAreaView className={`${bgColor}`}>
        <View className={`flex items-center ${bgColor}`}>
          <Text
            className={`${textColor} text-2xl font-bold mb-5 text-center border-b border-gray-300 pb-2 w-[75%]`}
          >
            Time Track
          </Text>
        </View>
        <TimeTrackComp />
      </SafeAreaView>
    </>
  );
};

export default monthlyView;

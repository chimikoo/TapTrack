import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

const ReceiptDetail = () => {
  const { receiptId } = useLocalSearchParams();
  console.log("receiptId", receiptId);
  return (
    <View>
      <Text>ReceiptDetail</Text>
    </View>
  );
};

export default ReceiptDetail;

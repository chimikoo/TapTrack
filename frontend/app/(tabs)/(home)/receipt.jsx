import { router, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton.jsx";
import { useEffect, useState } from "react";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";
import PaymentModal from "../../../components/PaymentModal.jsx";
import ReceiptComponent from "../../../components/ReceiptComponent.jsx";
import { useTheme } from "../../../contexts/themeContext.jsx";

const Receipt = () => {
  const { receiptId } = useLocalSearchParams();
  const [receipt, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { theme, bgColor } = useTheme();

  useEffect(() => {
    const getReceipt = async () => {
      try {
        setLoading(true);
        const url = `${TAP_TRACK_URL}/users/checkout/${receiptId}`;
        const { data } = await axios.get(url);
        setReceipt(data.data);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
      }
    };
    getReceipt();
  }, []);

  const handlePayment = async () => {
    try {
      const url = `${TAP_TRACK_URL}/users/checkout/${receiptId}`;
      const data = {
        paymentMethod,
        notes: tipAmount,
        isPaid: true,
      };
      const response = await axios.patch(url, data);
      setModalVisible((prevModalVisible) => !prevModalVisible);
      // navigate to the home screen
      router.push("/(tabs)/(home)");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <SafeAreaView className={`flex-1 items-center px-4 pb-4 ${bgColor}`}>
      <ReceiptComponent
        receipt={receipt}
        loading={loading}
        tipAmount={tipAmount}
      />
      {isPrinted ? (
        <View className="w-full flex-row justify-between mt-4">
          <CustomButton
            text="Cash"
            containerStyles="w-[40%]"
            handlePress={() => {
              setModalVisible((prevModalVisible) => !prevModalVisible);
              setPaymentMethod("Cash");
            }}
          />
          <CustomButton
            text="Card"
            containerStyles="w-[40%]"
            handlePress={() => {
              setModalVisible((prevModalVisible) => !prevModalVisible);
              setPaymentMethod("Credit Card");
            }}
          />
        </View>
      ) : (
        <View className="w-full flex items-end mt-4">
          <CustomButton
            text="Print"
            containerStyles="w-[40%]"
            handlePress={() => setIsPrinted((prevIsPrinted) => !prevIsPrinted)}
          />
        </View>
      )}
      <PaymentModal
        text="Add Tip"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        amount={tipAmount}
        handleAmount={setTipAmount}
        handleConfirm={handlePayment}
      />
    </SafeAreaView>
  );
};

export default Receipt;

import axios from "axios";
import { TAP_TRACK_URL } from "@env";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ReceiptComponent from "../../../components/ReceiptComponent.jsx";
import CustomButton from "../../../components/CustomButton.jsx";
import PaymentModal from "../../../components/PaymentModal.jsx";
import { useTheme } from "../../../contexts/themeContext.jsx";

const ReceiptDetail = () => {
  const { receiptId } = useLocalSearchParams();
  const [receipt, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);
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
        setTipAmount(data.data.notes || 0); // Set initial tip amount from receipt notes
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getReceipt();
  }, [receiptId]);

  const handlePayment = async () => {
    try {
      const url = `${TAP_TRACK_URL}/users/checkout/${receiptId}`;
      const data = {
        paymentMethod,
        notes: tipAmount,
        isPaid: true,
      };
      await axios.patch(url, data);
      setModalVisible(false);
      router.push("/receipts");
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <View className={`h-full ${bgColor}`}>
      <View className="h-[83%] m-4">
        <ReceiptComponent
          receipt={receipt}
          loading={loading}
          tipAmount={tipAmount} // Use tipAmount from state
        />
      </View>
      <View className="flex-row justify-between items-center p-4">
        <View className="flex-row w-[50%] justify-between">
          {!receipt.isPaid && (
            <>
              <CustomButton
                text="Card"
                handlePress={() => {
                  setModalVisible(true);
                  setPaymentMethod("Credit Card");
                }}
                containerStyles="w-[45%]"
              />
              <CustomButton
                text="Cash"
                handlePress={() => {
                  setModalVisible(true);
                  setPaymentMethod("Cash");
                }}
                containerStyles="w-[45%]"
              />
            </>
          )}
        </View>
        <CustomButton
          text="Print"
          handlePress={() => console.log("Print receipt")}
          containerStyles="w-[30%]"
        />
      </View>
      <PaymentModal
        text="Add Tip"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        amount={tipAmount}
        handleAmount={setTipAmount}
        handleConfirm={handlePayment}
      />
    </View>
  );
};

export default ReceiptDetail;

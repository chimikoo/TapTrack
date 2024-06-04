import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/CustomButton.jsx";
import { useEffect, useState } from "react";
import { TAP_TRACK_URL } from "@env";
import axios from "axios";
import PaymentModal from "../../../components/PaymentModal.jsx";

const Receipt = () => {
  const { receiptId } = useLocalSearchParams();
  const [receipt, setReceipt] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPrinted, setIsPrinted] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [tipAmount, setTipAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("");

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

  const items = receipt.items || [];
  const order = receipt.orderId || {};
  const transactionDate = receipt.transactionDate || "";

  console.log("paymentMethod", paymentMethod);
  console.log("tipAmount", tipAmount);

  const handlePayment = async () => {
    try {
      const url = `${TAP_TRACK_URL}/users/checkout/${receiptId}`;
      const data = {
        paymentMethod,
        notes: tipAmount,
        isPaid: true,
      };
      const response = await axios.patch(url, data);
      console.log("response", response);
      setModalVisible((prevModalVisible) => !prevModalVisible);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter items-center px-4 pb-4">
      <ScrollView className="w-full flex-1 bg-gray-200 rounded-lg p-8">
        {loading ? (
          <ActivityIndicator size="large" color="#7CA982" />
        ) : (
          <>
            <Text className="text-2xl font-bold text-center">Lagoon Plaza</Text>
            <Text className="text-center mt-6">--------------------------</Text>
            <View className="flex-row justify-between items-center pt-4">
              <Text>Order: </Text>
              <Text>{order?._id ?? ""}</Text>
            </View>
            <View className="flex-row justify-between items-center pt-4">
              <Text>Date:</Text>
              <Text>{transactionDate.slice(0, 10)}</Text>
              <Text>{transactionDate.slice(11, 16)}</Text>
            </View>
            <Text className="text-center mt-4">--------------------------</Text>
            <View className="flex-row justify-between items-center pt-4">
              <Text>Host: {order?.userId?.firstName ?? "Default Name"}</Text>
              <Text>Table No: {receipt.tableNumber}</Text>
            </View>
            <Text className="text-center mt-4">--------------------------</Text>
            <View>
              {items &&
                items.map((item, index) => {
                  return (
                    <View
                      key={index}
                      className="flex flex-row justify-between pt-4"
                    >
                      <Text className="w-[10%]">{item.quantity}</Text>
                      <Text className="w-[40%]">{item.itemName}</Text>
                      <Text className="text-right">{item.price}</Text>
                      <Text className="text-right">
                        {item.price * item.quantity}
                      </Text>
                    </View>
                  );
                })}
            </View>
            <Text className="text-center mt-4">--------------------------</Text>
            <View className="flex-row justify-between items-center pt-4 mb-10">
              <Text className="text-lg font-bold">Total</Text>
              <Text className="text-lg font-bold">
                {receipt?.totalAmount?.toFixed(2)}€
              </Text>
            </View>
          </>
        )}
      </ScrollView>
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
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        tipAmount={tipAmount}
        setTipAmount={setTipAmount}
        handlePayment={handlePayment}
      />
    </SafeAreaView>
  );
};

export default Receipt;

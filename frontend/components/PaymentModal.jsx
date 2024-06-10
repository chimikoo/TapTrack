import { View, Text, Modal, TextInput } from "react-native";
import CustomButton from "./CustomButton.jsx";

const PaymentModal = ({
  text,
  modalVisible,
  setModalVisible,
  amount,
  handleAmount,
  handleConfirm,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible((prevModalVisible) => !prevModalVisible);
      }}
    >
      <View className="w-full h-full bg-black opacity-50 absolute top-0 left-0"></View>
      <View className="w-[70%] h-[200px] p-4 border border-primary-dark rounded-lg flex justify-center items-center absolute top-[40%] left-[15%] bg-myWhite">
        <View className="flex-row gap-2 items-center">
          <Text>{text}</Text>
          <TextInput
            placeholder="Enter Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => handleAmount(Number(text))}
            className="border border-gray-300 rounded p-2 mb-4 w-[60%]"
          />
        </View>
        <View className="flex-row justify-between w-full">
          <CustomButton
            text="Cancel"
            containerStyles="w-[40%]"
            handlePress={() =>
              setModalVisible((prevModalVisible) => !prevModalVisible)
            }
          />
          <CustomButton
            text="Confirm"
            containerStyles="w-[40%]"
            handlePress={handleConfirm}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PaymentModal;

import { View, Text, Modal } from "react-native";
import CustomButton from "./CustomButton.jsx";

const DeleteModal = ({ modalVisible, setModalVisible, handleDelete }) => {
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
        <Text className="text-lg font-bold text-primary-dark mb-4">
          Are you sure you want to delete?
        </Text>
        <View className="flex-row justify-between w-full">
          <CustomButton
            text="No"
            containerStyles="w-[40%] bg-secondary"
            handlePress={() =>
              setModalVisible((prevModalVisible) => !prevModalVisible)
            }
          />
          <CustomButton
            text="Yes"
            containerStyles="w-[40%] bg-primary"
            handlePress={handleDelete}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModal;

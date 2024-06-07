import { View, Text, TouchableOpacity, Image } from "react-native";

const EditButton = () => {
  return (
    <TouchableOpacity className="w-6 h-6 flex justify-center items-center bg-primary-dark rounded">
      <Image
        source={require("../assets/icons/edit_icon.png")}
        className="w-4 h-4"
        tintColor={"#fff"}
      />
    </TouchableOpacity>
  );
};

export default EditButton;

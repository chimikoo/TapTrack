import { View, Text, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import emptyTable from "../assets/icons/empty-table.png";
import occTable from "../assets/icons/occ-table.png";
import resTable from "../assets/icons/res-table.png";

const Table = ({ tableNumber, state }) => {
  const navigation = useNavigation();

  const stateStyle =
    state === "available"
      ? "bg-primary"
      : state === "occupied"
      ? "bg-secondary"
      : "bg-tertiary";

  const icon =
    state === "available"
      ? emptyTable
      : state === "occupied"
      ? occTable
      : resTable;

  return (
    <TouchableOpacity key={tableNumber}>
      <View
        className={`${stateStyle} w-[20vh] h-[16vh] flex justify-center items-center mb-4 mr-4 ml-4 rounded-lg`}
      >
        <Image source={icon} resizeMode="contain" className="w-1/2 h-1/2" />
        <Text className="text-lg">{tableNumber}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Table;

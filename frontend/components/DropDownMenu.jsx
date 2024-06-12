import { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UserContext } from "../contexts/userContext.jsx";
import { Icon } from "@rneui/themed";

const DropDownMenu = ({
  visible,
  onClose,
  onLogout,
  onProfile,
  onSettings,
  onTimeTrack,
  onReceipts,
  onOrders,
  onAdminPanel,
}) => {
  const { user } = useContext(UserContext);

  if (!visible) return null;

  const menuItems = [
    {
      label: "Profile",
      action: onProfile,
      iconName: "user",
      iconType: "feather",
    },
    {
      label: "Settings",
      action: onSettings,
      iconName: "settings",
      iconType: "feather",
    },
    {
      label: "Orders",
      action: onOrders,
      iconName: "shopping-cart",
      iconType: "feather",
    },
    {
      label: "Receipts",
      action: onReceipts,
      iconName: "file-text",
      iconType: "feather",
    },
    {
      label: "Time Track",
      action: onTimeTrack,
      iconName: "history",
      iconType: "oticons",
    },
    {
      label: "Logout",
      action: onLogout,
      iconName: "log-out",
      iconType: "feather",
    },
  ];

  if (user.role === "admin") {
    menuItems.splice(5, 0, {
      label: "Admin",
      action: onAdminPanel,
      iconName: "shield",
      iconType: "feather",
    });
  }

  return (
    <TouchableOpacity
      className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-90 justify-center items-center z-50"
      onPress={onClose}
    >
      <View className="w-50  rounded-lg overflow-hidden">
        <View className="items-center">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className={`w-[90%] flex-row items-center justify-start p-4 ${
                index < menuItems.length - 1 ? "border-b border-gray-300" : ""
              }`}
              onPress={item.action ? item.action : onClose}
            >
              <Icon name={item.iconName} color="#fff" type={item.iconType} />
              <Text className="ml-4 text-white text-xl font-bold">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DropDownMenu;

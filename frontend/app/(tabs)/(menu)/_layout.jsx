import { Slot } from "expo-router";
import { MenuProvider } from "../../../contexts/menuContext";

const MenuLayout = () => {
  return (
    <MenuProvider>
      <Slot />
    </MenuProvider>
  );
};

export default MenuLayout;

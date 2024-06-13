import { Slot } from "expo-router";
import { OrderProvider } from "../../../contexts/orderContext";
import { MenuProvider } from "../../../contexts/menuContext";

const HomeLayout = () => {
  return (
    <OrderProvider>
      <MenuProvider>
        <Slot />
      </MenuProvider>
    </OrderProvider>
  );
};

export default HomeLayout;
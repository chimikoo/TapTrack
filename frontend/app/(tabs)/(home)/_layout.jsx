import { Slot } from "expo-router";
import { OrderProvider } from "../../../contexts/orderContext";

const HomeLayout = () => {
  return (
    <OrderProvider>
      <Slot />
    </OrderProvider>
  );
};

export default HomeLayout;

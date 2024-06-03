import { View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import Table from "../../../components/Table.jsx";
import { router } from "expo-router";
import { TAP_TRACK_URL } from "@env";


const Home = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const getTables = async () => {
      try {
        const { data } = await axios.get(`${TAP_TRACK_URL}/users/tables`);

        const sortedTables = data.tables.sort(
          (a, b) => a.tableNumber - b.tableNumber
        );
        setTables(sortedTables);
      } catch (error) {
        console.log("error", error);
      }
    };

    getTables();

    return () => {
      console.log("cleanup");
    };
  }, []);

  return (
    <SafeAreaView className="h-full bg-primary-lighter">
      <ScrollView className="w-full mb-4">
        <View className="w-full flex flex-row flex-wrap items-center justify-center">
          {tables.map((table) => (
            <Table
              key={table.tableNumber}
              tableNumber={table.tableNumber}
              state={table.state}
              handleTablePress={() =>
                router.push({
                  pathname: "/(tabs)/(home)/order",
                  params: { tableNumber: table.tableNumber},
                })
              }
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;


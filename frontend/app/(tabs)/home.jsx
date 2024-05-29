import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import CustomButton from "../../components/CustomButton.jsx";
import { SafeAreaView } from "react-native-safe-area-context";

import emptyTable from "../../assets/icons/empty-table.png";
import Table from "../../components/Table.jsx";


const Home = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const getTables = async () => {
      try {
        const { data } = await axios.get(
          "https://application-server.loca.lt/users/tables"
        );

        const sortedTables = data.tables.sort((a, b) => a.tableNumber - b.tableNumber);
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
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;


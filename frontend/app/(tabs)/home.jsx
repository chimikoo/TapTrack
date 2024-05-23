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
        console.log("data", data);
        setTables(data.tables);
      } catch (error) {
        console.log("error", error);
      }
    };

    getTables();

    return () => {
      console.log("cleanup");
    };
  }, []);

  const logout = async () => {
    try {
      const { data } = await axios.get(
        "https://application-server.loca.lt/users/logout"
      );
      console.log("data", data);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView className="h-full bg-primary-lighter">
      <ScrollView className="w-full mb-4">
        <View className="w-full flex flex-row flex-wrap items-center justify-center">
          {tables.map((table) => (
            <Table
              key={table.id}
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

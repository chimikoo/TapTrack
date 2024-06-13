import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import Svg, { Text as SvgText } from "react-native-svg";
import MyBarChart from "../../../components/BarChart";
import CustomButton from "../../../components/CustomButton";

export default function DashboardScreen() {
  
  const [activeTab, setActiveTab] = useState("Weekly");

  const getTabStyle = (tab) => {
    return activeTab === tab
      ? "text-black border-b-2 border-black"
      : "text-gray-400";
  };

  return (
    <View className="flex-1 bg-primary-lighter">
      <ScrollView className="flex-1 pt-5 pl-2 pr-2">
        <View className="bg-primary-lighter shadow p-2">
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity onPress={() => setActiveTab("Weekly")}>
              <Text className={`pb-2 ${getTabStyle("Weekly")}`}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("Monthly")}>
              <Text className={`pb-2 ${getTabStyle("Monthly")}`}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab("Yearly")}>
              <Text className={`pb-2 ${getTabStyle("Yearly")}`}>Yearly</Text>
            </TouchableOpacity>
          </View>

          {activeTab === "Weekly" && (
            <View className="bg-primary-lighter">
              <View className="bg-primary-light flex justify-between items-center flex-row p-2 mb-2">
                <Text className="text-xl font-bold text-center pl-5">
                  Total Orders
                </Text>
                <Text className="text-center pr-5">10</Text>
              </View>
              <View className="flex-row justify-between">
                <View className="flex-1 justify-between items-center flex-row mr-2 bg-primary-light p-3">
                  <Text className="text-center font-bold">Paid</Text>
                  <Text className="text-center">8</Text>
                </View>
                <View className="flex-1 justify-between items-center flex-row bg-primary-light p-3">
                  <Text className="text-center font-bold">Unpaid</Text>
                  <Text className="text-center">2</Text>
                </View>
              </View>
              <View className="flex-row justify-between gap-2 mt-1">
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Revenue</Text>
                  <Text className="text-center text-xs">3.000€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Cash</Text>
                  <Text className="text-center text-xs">1.500€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Card</Text>
                  <Text className="text-center text-xs">1.500€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold">Loss</Text>
                  <Text className="text-center text-xs">100€</Text>
                </View>
              </View>
              <View className="flex-row justify-between mt-4">
                <View className="flex-1 mr-2 bg-primary p-2">
                  <Text className="text-center font-bold text-xs">
                    Food sold
                  </Text>
                  <Text className="text-center">50€</Text>
                </View>
                <View className="flex-1 ml-2 bg-primary p-2">
                  <Text className="text-center font-bold text-xs">
                    Drinks sold
                  </Text>
                  <Text className="text-center">100€</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === "Monthly" && (
            <View className="bg-primary-lighter">
              <View className="bg-primary-light flex justify-between items-center flex-row p-2 mb-2">
                <Text className="text-xl font-bold text-center pl-5">
                  Total Orders
                </Text>
                <Text className="text-center pr-5">100</Text>
              </View>
              <View className="flex-row justify-between">
                <View className="flex-1 justify-between items-center flex-row mr-2 bg-primary-light p-3">
                  <Text className="text-center font-bold">Paid</Text>
                  <Text className="text-center">80</Text>
                </View>
                <View className="flex-1 justify-between items-center flex-row bg-primary-light p-3">
                  <Text className="text-center font-bold">Unpaid</Text>
                  <Text className="text-center">20</Text>
                </View>
              </View>
              <View className="flex-row justify-between gap-2 mt-1">
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Revenue</Text>
                  <Text className="text-center text-xs">9.000€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Cash</Text>
                  <Text className="text-center text-xs">2.500€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Card</Text>
                  <Text className="text-center text-xs">6.500€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold">Loss</Text>
                  <Text className="text-center text-xs">950€</Text>
                </View>
              </View>
              <View className="flex-row justify-between mt-4">
                <View className="flex-1 mr-2 bg-primary p-2">
                  <Text className="text-center font-bold text-xs">
                    Food sold
                  </Text>
                  <Text className="text-center">500€</Text>
                </View>
                <View className="flex-1 ml-2 bg-primary p-2">
                  <Text className="text-center font-bold text-xs">
                    Drinks sold
                  </Text>
                  <Text className="text-center">1000€</Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === "Yearly" && (
            <View className="bg-primary-lighter">
              <View className="bg-primary-light flex justify-between items-center flex-row p-2 mb-2">
                <Text className="text-xl font-bold text-center pl-5">
                  Total Orders
                </Text>
                <Text className="text-center pr-5">40</Text>
              </View>
              <View className="flex-row justify-between">
                <View className="flex-1 justify-between items-center flex-row mr-2 bg-primary-light p-3">
                  <Text className="text-center font-bold">Paid</Text>
                  <Text className="text-center">33</Text>
                </View>
                <View className="flex-1 justify-between items-center flex-row bg-primary-light p-3">
                  <Text className="text-center font-bold">Unpaid</Text>
                  <Text className="text-center">7</Text>
                </View>
              </View>
              <View className="flex-row justify-between gap-2 mt-1">
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Revenue</Text>
                  <Text className="text-center text-xs">43.000€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Cash</Text>
                  <Text className="text-center text-xs">21.500€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold text-xs">Card</Text>
                  <Text className="text-center text-xs">11.500€</Text>
                </View>
                <View className="justify-center flex-1 bg-primary-light p-3">
                  <Text className="text-center font-bold">Loss</Text>
                  <Text className="text-center text-xs">1200€</Text>
                </View>
              </View>
              <View className="flex-row justify-between mt-4">
                <View className="flex-1 mr-2 bg-primary p-2">
                  <Text className="text-center font-bold text-xs">
                    Food sold
                  </Text>
                  <Text className="text-center">3200€</Text>
                </View>
                <View className="flex-1 ml-2 bg-primary p-2">
                  <Text className="text-center font-bold text-xs">
                    Drinks sold
                  </Text>
                  <Text className="text-center">6000€</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        <MyBarChart />
        <TouchableOpacity>
          <CustomButton text='Generate EoD' containerStyles={"mb-5"}/>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

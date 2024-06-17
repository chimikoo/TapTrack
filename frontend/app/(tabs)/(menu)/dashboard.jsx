import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import MyBarChart from "../../../components/BarChart";
import CustomButton from "../../../components/CustomButton";
import axios from "axios";
import { TAP_TRACK_URL } from "@env";

export default function DashboardScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const bgColor = "bg-primary-lighter";

  const fetchData = async () => {
    try {
      console.log('Fetching data...');
      console.log(`Start Date: ${startDate.toISOString()}`);
      console.log(`End Date: ${endDate.toISOString()}`);
      const { data } = await axios.get(`${TAP_TRACK_URL}/eod/receipts/date-range`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      setReceipts(data.data);
      console.log('Data fetched:', data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };

  const handleStartDateConfirm = (date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };

  const handleEndDateConfirm = (date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const aggregateData = (receipts) => {
    const dailyRevenue = {};

    receipts.forEach(receipt => {
      const date = new Date(receipt.transactionDate);
      console.log('dashboard', date)
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = 0;
      }
      dailyRevenue[date] += receipt.totalAmount;
    });

    return Object.keys(dailyRevenue).map(date => ({
      date,
      totalRevenue: dailyRevenue[date],
    }));
  };

  const aggregatedData = aggregateData(receipts);

  const totalOrders = receipts.length;
  const totalUnpaid = receipts.filter(receipt => !receipt.isPaid).length;
  const totalPaid = totalOrders - totalUnpaid;

  const paidReceipts = receipts.filter(receipt => receipt.isPaid);

  const totalCashRevenue = paidReceipts
    .filter(receipt => receipt.paymentMethod === 'Cash')
    .reduce((acc, receipt) => acc + receipt.totalAmount, 0)
    .toFixed(2);

  const totalCardRevenue = paidReceipts
    .filter(receipt => receipt.paymentMethod === 'Credit Card')
    .reduce((acc, receipt) => acc + receipt.totalAmount, 0)
    .toFixed(2);

  const totalRevenue = paidReceipts
    .reduce((acc, receipt) => acc + receipt.totalAmount, 0)
    .toFixed(2);

  const totalLoss = receipts
    .filter(receipt => !receipt.isPaid)
    .reduce((acc, receipt) => acc + receipt.totalAmount, 0)
    .toFixed(2);

  const totalFoodSold = receipts.reduce((acc, receipt) => {
    const starterItems = receipt.items.filter(item => item.category === 'starter');
    const mainItems = receipt.items.filter(item => item.category === 'main');
    const sideItems = receipt.items.filter(item => item.category === 'side');
    const dessertItems = receipt.items.filter(item => item.category === 'dessert');
    return acc + starterItems.length + mainItems.length + sideItems.length + dessertItems.length;
  }, 0);

  const totalDrinksSold = receipts.reduce((acc, receipt) => {
    const drinkItems = receipt.items.filter(item => item.category === 'beverage');
    return acc + drinkItems.length;
  }, 0);

  return (
    <View className="flex-1 bg-primary-lighter">
      <ScrollView className="flex-1 pt-5 pl-2 pr-2">
        <View className="bg-primary-lighter shadow p-2">
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity className="flex-row items-center p-2 border border-black rounded" onPress={showStartDatePicker}>
              <Text className="mr-2 text-lg">{formatDate(startDate)}</Text>
              <Icon name="calendar" size={20} color="#6D9773" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center p-2 border border-black rounded" onPress={showEndDatePicker}>
              <Text className="mr-2 text-lg">{formatDate(endDate)}</Text>
              <Icon name="calendar" size={20} color="#6D9773" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isStartDatePickerVisible}
              mode="date"
              onConfirm={handleStartDateConfirm}
              onCancel={hideStartDatePicker}
            />
            <DateTimePickerModal
              isVisible={isEndDatePickerVisible}
              mode="date"
              onConfirm={handleEndDateConfirm}
              onCancel={hideEndDatePicker}
            />
          </View>

          <View className="bg-primary-lighter">
            <View className="bg-primary-light flex justify-between items-center flex-row p-2 mb-2">
              <Text className="text-xl font-bold text-center pl-5">
                Total Orders
              </Text>
              <Text className="text-center pr-5">{totalOrders}</Text>
            </View>
            <View className="flex-row justify-between">
              <View className="flex-1 justify-between items-center flex-row mr-2 bg-primary-light p-3">
                <Text className="text-center font-bold">Paid</Text>
                <Text className="text-center">{totalPaid}</Text>
              </View>
              <View className="flex-1 justify-between items-center flex-row bg-primary-light p-3">
                <Text className="text-center font-bold">Unpaid</Text>
                <Text className="text-center">{totalUnpaid}</Text>
              </View>
            </View>
            <View className="flex-row justify-between gap-2 mt-1">
              <View className="justify-center flex-1 bg-primary-light p-3">
                <Text className="text-center font-bold text-xs">Revenue</Text>
                <Text className="text-center text-xs">{totalRevenue}€</Text>
              </View>
              <View className="justify-center flex-1 bg-primary-light p-3">
                <Text className="text-center font-bold text-xs">Cash</Text>
                <Text className="text-center text-xs">
                  {totalCashRevenue}€
                </Text>
              </View>
              <View className="justify-center flex-1 bg-primary-light p-3">
                <Text className="text-center font-bold text-xs">Card</Text>
                <Text className="text-center text-xs">
                  {totalCardRevenue}€
                </Text>
              </View>
              <View className="justify-center flex-1 bg-primary-light p-3">
                <Text className="text-center font-bold">Loss</Text>
                <Text className="text-center text-xs">{totalLoss}€</Text>
              </View>
            </View>
            <View className="flex-row justify-between mt-4">
              <View className="flex-1 mr-2 bg-primary p-2">
                <Text className="text-center font-bold text-xs">
                  Food sold
                </Text>
                <Text className="text-center">{totalFoodSold}</Text>
              </View>
              <View className="flex-1 ml-2 bg-primary p-2">
                <Text className="text-center font-bold text-xs">
                  Drinks sold
                </Text>
                <Text className="text-center">{totalDrinksSold}</Text>
              </View>
            </View>
          </View>
        </View>
        <MyBarChart eods={aggregatedData} />
        <TouchableOpacity className="p-2">
          <CustomButton text="Generate EoD" containerStyles={"mb-5"} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

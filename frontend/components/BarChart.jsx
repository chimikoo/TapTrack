import React from "react";
import { View, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundGradientFrom: "#F1F7ED",
  backgroundGradientTo: "#F1F7ED",
  color: () => `#6d9773`, // Solid color for text and lines
  barPercentage: 0.5,
  fillShadowGradientFrom: "#6d9773", // Solid color for the bars (start)
  fillShadowGradientFromOpacity: 1, // Fully opaque
  fillShadowGradientTo: "#6d9773", // Solid color for the bars (end)
  fillShadowGradientToOpacity: 1, // Fully opaque
  fromZero: true, // Ensure the y-axis starts from 0
  yAxisInterval: 1, // Set the interval for y-axis
};

const getDayName = (timestamp) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const date = new Date(timestamp);
  return days[date.getDay()];
};

const MyBarChart = ({ eods }) => {
  const screenWidth = Dimensions.get("window").width;
  
  const lastWeekEods = eods.slice(-7);
  const labels = lastWeekEods.map((eod) => getDayName(eod.timestamp));
  const revenues = lastWeekEods.map((eod) => eod.totalRevenue);
  // const losses = lastWeekEods.map((eod) => eod.totalLoss);

  const data = {
    labels: labels,
    datasets: [
      {
        data: revenues,
        color: () => `#6d9773`,
        strokeWidth: 4, // optional
      },
    ],
  };

  return (
    <View>
      <BarChart
        className="mt-4"
        data={data}
        width={screenWidth - 25}
        height={320}
        yAxisLabel="€"
        chartConfig={chartConfig}
        verticalLabelRotation={0}
        fromZero={true}
      />
    </View>
  );
};

export default MyBarChart;

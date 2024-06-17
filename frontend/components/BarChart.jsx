import React from "react";
import { View, Dimensions, Text, ScrollView } from "react-native";
import { BarChart } from "react-native-chart-kit";

const chartConfig = {
  backgroundGradientFrom: "#F1F7ED",
  backgroundGradientTo: "#F1F7ED",
  color: () => `#6d9773`,
  barPercentage: 0.5,
  fillShadowGradientFrom: "#6d9773",
  fillShadowGradientFromOpacity: 1,
  fillShadowGradientTo: "#6d9773",
  fillShadowGradientToOpacity: 1,
  fromZero: true,
  yAxisInterval: 1,
  formatYLabel: (value) => `${parseInt(value).toString()}`,
  labelPadding: 10, // Add label padding
};

const MyBarChart = ({ eods }) => {
  const screenWidth = Dimensions.get("window").width;

  // Ensure we have valid data
  if (!eods || !Array.isArray(eods) || eods.length === 0) {
    return (
      <View className="flex items-center justify-center h-full">
        <Text className="text-lg">No data available</Text>
      </View>
    );
  }

  // Function to format the date as "day-month-year"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  };

  // Sort eods by date
  const sortedEods = eods.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Extract labels and revenues, ensuring we don't have undefined values
  const labels = sortedEods.map((eod) => formatDate(eod.date));
  const revenues = sortedEods.map((eod) => Math.round(eod.totalRevenue)); // Round the values

  const data = {
    labels: labels,
    datasets: [
      {
        data: revenues,
        color: () => `#6d9773`,
        strokeWidth: 4,
      },
    ],
  };

  // Ensure data consistency
  if (data.labels.length !== data.datasets[0].data.length) {
    console.error('Data inconsistency: labels and datasets length mismatch');
    return (
      <View className="flex items-center justify-center h-full">
        <Text className="text-lg">Data inconsistency error</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <View style={{ width: Math.max(screenWidth, data.labels.length * 50) }}>
        <BarChart
          data={data}
          width={Math.max(screenWidth, data.labels.length * 50)}
          height={340}
          yAxisLabel="€"
          chartConfig={chartConfig}
          verticalLabelRotation={45}
          fromZero={true}
          showValuesOnTopOfBars={true} // Show values on top of the bars
          formatYLabel={(value) => `${parseInt(value).toString()}`}
        />
      </View>
    </ScrollView>
  );
};

export default MyBarChart;

import React from 'react';
import { View, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      data: [25, 45, 28, 80, 100, 43, 50],
    },
  ],
};

const chartConfig = {
  backgroundColor: "#E0EEC6",
  backgroundGradientFrom: "#E0EEC6",
  backgroundGradientTo: "#E0EEC6",
  color: () => `#6d9773`,  // Solid color for text and lines
  barPercentage: 0.5,
  fillShadowGradientFrom: "#6d9773",  // Solid color for the bars (start)
  fillShadowGradientFromOpacity: 1,  // Fully opaque
  fillShadowGradientTo: "#6d9773",  // Solid color for the bars (end)
  fillShadowGradientToOpacity: 1,  // Fully opaque
  fromZero: true,  // Ensure the y-axis starts from 0
  yAxisInterval: 1,  // Set the interval for y-axis
};

const MyBarChart = () => {
  const screenWidth = Dimensions.get("window").width;
  
  return (
    <View>
      <BarChart
        className="mt-4"
        data={data}
        width={screenWidth -25}
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

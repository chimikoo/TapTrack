// components/Filters.jsx
import { Picker } from "@react-native-picker/picker";
import { TextInput, View } from "react-native";
import CustomButton from "./CustomButton.jsx";

const Filters = ({
  name,
  setName,
  price,
  setPrice,
  category,
  setCategory,
  sortBy,
  setSortBy,
  limit,
  setLimit,
}) => {
  return (
    <>
      <View className="flex flex-row justify-between items-center mb-4 space-x-2">
        <TextInput
          className="w-[30%] h-10 px-2 border bg-[#F5F5F5] border-gray-300 rounded"
          placeholder="name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          className="w-[30%] h-10 px-2 border bg-[#F5F5F5] border-gray-300 rounded"
          placeholder="price"
          value={price}
          onChangeText={setPrice}
        />
        <View className="w-[30%] h-10 bg-[#F5F5F5] rounded-lg border border-gray-300 justify-center">
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            className="w-full h-full"
          >
            <Picker.Item label="Select category" value="" />
            <Picker.Item label="Starters" value="starter" />
            <Picker.Item label="Drinks" value="beverage" />
            <Picker.Item label="Main" value="main" />
            <Picker.Item label="Side" value="side" />
            <Picker.Item label="Dessert" value="dessert" />
          </Picker>
        </View>
      </View>
      <View className="flex flex-row justify-between items-center mb-4 space-x-2">
        <View className="w-[30%] h-10 bg-[#F5F5F5] rounded-lg border border-gray-300 justify-center">
          <Picker
            selectedValue={sortBy}
            onValueChange={(itemValue) => setSortBy(itemValue)}
            className="w-full h-full"
          >
            <Picker.Item label="Sort by" value="" />
            <Picker.Item label="Name" value="name" />
            <Picker.Item label="Price" value="price" />
            <Picker.Item label="Category" value="category" />
          </Picker>
        </View>
        <TextInput
          className="w-[30%] h-10 bg-[#F5F5F5] px-2 border border-gray-300 rounded"
          placeholder="limit"
          value={limit}
          onChangeText={setLimit}
        />
        <CustomButton
          text="Filter"
          containerStyles="w-[30%] h-10 ml-2"
          handlePress={() => {
            /* Implement filter logic */
          }}
        />
      </View>
    </>
  );
};

export default Filters;

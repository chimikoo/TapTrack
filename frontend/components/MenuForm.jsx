import { Picker } from "@react-native-picker/picker";
import { View, Text, ScrollView, TextInput, Switch } from "react-native";

const MenuForm = ({ menuItem, setMenuItem }) => {
  return (
    <ScrollView className="h-[75%]">
      <TextInput
        value={menuItem.name}
        placeholder={"Enter Name"}
        placeholderTextColor="#8e8e8e"
        onChangeText={(text) => setMenuItem({ ...menuItem, name: text })}
        className="w-full h-[6vh] mb-4 px-4 rounded-lg border border-primary-dark bg-myWhite"
      />
      <View className="w-full h-[6vh] mb-4 px-4 rounded-lg border border-primary-dark bg-myWhite flex justify-center ">
        <Picker
          selectedValue={menuItem.category}
          onValueChange={(itemValue, itemIndex) =>
            setMenuItem({ ...menuItem, category: itemValue })
          }
          className="w-full"
        >
          <Picker.Item label="Starter" value="starter" />
          <Picker.Item label="Main" value="main" />
          <Picker.Item label="Side" value="side" />
          <Picker.Item label="Dessert" value="dessert" />
          <Picker.Item label="Drink" value="beverage" />
        </Picker>
      </View>
      <TextInput
        value={menuItem.description}
        placeholder={"Enter Description"}
        placeholderTextColor="#8e8e8e"
        onChangeText={(text) => setMenuItem({ ...menuItem, description: text })}
        className="w-full max-w-full h-auto mb-4 px-4 rounded-lg border border-primary-dark bg-myWhite"
        multiline={true}
        numberOfLines={4}
      />

      <TextInput
        value={menuItem.ingredients}
        placeholder={"Enter Ingredients"}
        placeholderTextColor="#8e8e8e"
        onChangeText={(text) => setMenuItem({ ...menuItem, ingredients: text })}
        className="w-full max-w-full h-auto mb-4 px-4 rounded-lg border border-primary-dark bg-myWhite"
        multiline={true}
        numberOfLines={3}
      />

      {menuItem.category !== "beverage" ? (
        <TextInput
          value={menuItem.price.toString()}
          placeholder={"Enter Price"}
          placeholderTextColor="#8e8e8e"
          onChangeText={(text) => setMenuItem({ ...menuItem, price: text })}
          className="w-full h-[6vh] mb-4 px-4 rounded-lg border border-primary-dark bg-myWhite"
          keyboardType="numeric"
        />
      ) : (
        ["small", "medium", "large"].map((size, index) => {
          return (
            <TextInput
              key={index}
              value={menuItem.sizesPrices[size].toString()}
              placeholder={`Enter Price for ${size}`}
              placeholderTextColor="#8e8e8e"
              onChangeText={(text) =>
                setMenuItem({
                  ...menuItem,
                  sizesPrices: { ...menuItem.sizesPrices, [size]: text },
                })
              }
              className="w-full h-[6vh] mb-4 px-4 rounded-lg border border-primary-dark bg-myWhite"
              keyboardType="numeric"
            />
          );
        })
      )}

      <View className="flex flex-row justify-between items-center w-full px-2">
        <Text className="text-lg">Is Vegan?</Text>
        <View className="transform scale-150">
          <Switch
            value={menuItem.isVegan}
            onValueChange={(value) =>
              setMenuItem({ ...menuItem, isVegan: value })
            }
            thumbColor={true ? "#C8C8C8" : "#FFFFFF"}
            trackColor={{ false: "#7CA982", true: "#81b0ff" }}
          />
        </View>
      </View>
      <View className="flex flex-row justify-between items-center w-full mb-4 px-2">
        <Text className="text-lg">Is Lactose Free?</Text>
        <View className="transform scale-150">
          <Switch
            value={menuItem.isLactoseFree}
            onValueChange={(value) =>
              setMenuItem({ ...menuItem, isLactoseFree: value })
            }
            thumbColor={true ? "#C8C8C8" : "#FFFFFF"}
            trackColor={{ false: "#7CA982", true: "#81b0ff" }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuForm;

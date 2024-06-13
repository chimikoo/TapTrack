import { Picker } from "@react-native-picker/picker";
import { View, Text, ScrollView, TextInput, Switch } from "react-native";
import { useTheme } from "../contexts/themeContext.jsx";

const MenuForm = ({ menuItem, setMenuItem }) => {
  const { theme, textColor } = useTheme();
  const bgAndBorderColor =
    theme === "light"
      ? "border-primary-dark bg-myWhite"
      : "border-primary-light bg-opacGray";

  return (
    <ScrollView className="h-[75%]">
      <TextInput
        value={menuItem.name}
        placeholder={"Enter Name"}
        placeholderTextColor="#8e8e8e"
        onChangeText={(text) => setMenuItem({ ...menuItem, name: text })}
        className={`w-full h-[6vh] mb-4 px-4 rounded-lg border ${bgAndBorderColor} ${textColor}`}
      />
      <View
        className={`w-full h-[6vh] mb-4 px-4 rounded-lg border flex justify-center ${bgAndBorderColor}`}
      >
        <Picker
          selectedValue={menuItem.category}
          onValueChange={(itemValue, itemIndex) =>
            setMenuItem({ ...menuItem, category: itemValue })
          }
          className={`w-full ${textColor}`}
          style={{
            height: 50,
            width: "100%",
            color: `${theme === "light" ? "#000" : "#fff"}`,
          }}
        >
          <Picker.Item label="Select the Category" value="" />
          <Picker.Item label="Starter" value="starter" />
          <Picker.Item label="Main" value="main" />
          <Picker.Item label="Side" value="side" />
          <Picker.Item label="Dessert" value="dessert" />
          <Picker.Item label="Drink" value="beverage" />
        </Picker>
      </View>
      {menuItem.category === "beverage" ? (
        <View
          className={`w-full h-[6vh] mb-4 px-4 rounded-lg border flex justify-center ${bgAndBorderColor}`}
        >
          <Picker
            selectedValue={menuItem.type}
            onValueChange={(itemValue, itemIndex) =>
              setMenuItem({ ...menuItem, type: itemValue })
            }
            className="w-full"
            style={{
              height: 50,
              width: "100%",
              color: `${theme === "light" ? "#000" : "#fff"}`,
            }}
          >
            <Picker.Item label="Select the Drink Type" value="" />
            <Picker.Item label="Wine" value="wine" />
            <Picker.Item label="Spirits" value="spirits" />
            <Picker.Item label="Beer" value="beer" />
            <Picker.Item label="Soda" value="soda" />
          </Picker>
        </View>
      ) : null}
      <TextInput
        value={menuItem.description}
        placeholder={"Enter Description"}
        placeholderTextColor="#8e8e8e"
        onChangeText={(text) => setMenuItem({ ...menuItem, description: text })}
        className={`w-full max-w-full h-auto mb-4 px-4 rounded-lg border ${bgAndBorderColor} ${textColor}`}
        multiline={true}
        numberOfLines={4}
      />

      <TextInput
        value={menuItem.ingredients}
        placeholder={"Enter Ingredients"}
        placeholderTextColor="#8e8e8e"
        onChangeText={(text) => setMenuItem({ ...menuItem, ingredients: text })}
        className={`w-full max-w-full h-auto mb-4 px-4 rounded-lg border ${bgAndBorderColor} ${textColor}`}
        multiline={true}
        numberOfLines={3}
      />

      {menuItem.category !== "beverage" ? (
        <TextInput
          value={menuItem.price.toString()}
          placeholder={"Enter Price"}
          placeholderTextColor="#8e8e8e"
          onChangeText={(text) => setMenuItem({ ...menuItem, price: text })}
          className={`w-full h-[6vh] mb-4 px-4 rounded-lg border ${bgAndBorderColor} ${textColor}`}
          keyboardType="numeric"
        />
      ) : (
        ["small", "medium", "large"].map((size, index) => {
          return (
            <TextInput
              key={index}
              value={menuItem.sizesPrices[index].price.toString()}
              placeholder={`Enter Price for ${size}`}
              placeholderTextColor="#8e8e8e"
              onChangeText={(text) => {
                // Create a copy of sizesPrices array
                const newSizesPrices = menuItem.sizesPrices.map((item, i) =>
                  i === index ? { ...item, price: text } : item
                );

                // Update the state
                setMenuItem({
                  ...menuItem,
                  sizesPrices: newSizesPrices.slice(0, 3),
                });
              }}
              className={`w-full h-[6vh] mb-4 px-4 rounded-lg border ${bgAndBorderColor} ${textColor}`}
              keyboardType="numeric"
            />
          );
        })
      )}

      <View className="flex flex-row justify-between items-center w-full px-2">
        <Text className={`${textColor} text-lg`}>Is Vegan?</Text>
        <View className="transform scale-150">
          <Switch
            value={menuItem.isVegan}
            onValueChange={(value) =>
              setMenuItem({ ...menuItem, isVegan: value })
            }
            thumbColor={true ? "#C8C8C8" : "#FFFFFF"}
            trackColor={{ false: "#B46617", true: "#6D9773" }}
          />
        </View>
      </View>
      <View className="flex flex-row justify-between items-center w-full mb-4 px-2">
        <Text className={`${textColor} text-lg`}>Is Lactose Free?</Text>
        <View className="transform scale-150">
          <Switch
            value={menuItem.isLactoseFree}
            onValueChange={(value) =>
              setMenuItem({ ...menuItem, isLactoseFree: value })
            }
            thumbColor={true ? "#C8C8C8" : "#FFFFFF"}
            trackColor={{ false: "#B46617", true: "#6D9773" }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default MenuForm;

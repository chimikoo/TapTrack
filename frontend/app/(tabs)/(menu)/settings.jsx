import React, { useState } from 'react';
import { View, Text, Switch, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../../components/CustomButton';

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter justify-center items-center pt-16">
      <Text className="text-3xl font-bold mb-6">Settings</Text>
      <View className="w-[80%] space-y-4">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg">Notifications</Text>
          <View className="transform scale-150">
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? "#C8C8C8" : "#FFFFFF"}
              trackColor={{ false: "#7CA982", true: "#81b0ff" }}
            />
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg">Theme</Text>
          <View className="w-[50%] bg-white rounded-lg border border-[#828282] h-12 justify-center">
            <Picker
              selectedValue={theme}
              onValueChange={(itemValue) => setTheme(itemValue)}
              className="w-full h-full"
            >
              <Picker.Item label="Light" value="light" />
              <Picker.Item label="Dark" value="dark" />
            </Picker>
          </View>
        </View>
        <View className="flex flex-row justify-between items-center">
          <Text className="text-lg">Language</Text>
          <View className="w-[50%] bg-white rounded-lg border border-[#828282] h-12 justify-center">
            <Picker
              selectedValue={language}
              onValueChange={(itemValue) => setLanguage(itemValue)}
              className="w-full h-full"
            >
              <Picker.Item label="English" value="en" />
              <Picker.Item label="German" value="de" />
              <Picker.Item label="Arabic" value="ar" />
            </Picker>
          </View>
        </View>
        <View className="w-full flex items-center mt-20">
          <CustomButton
            text="Save"
            containerStyles="w-[50%] mt-20"
            handlePress={() => {/* Handle save action */}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;

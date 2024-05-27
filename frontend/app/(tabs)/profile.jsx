import React from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import avatar from "../../assets/images/avatar.png";
import CustomButton from "../../components/CustomButton.jsx";

const Profile = () => {
  const navigation = useNavigation();

  const handleEditProfile = () => {
    navigation.navigate('editProfile');
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter justify-start items-center pt-16">
      <View className="items-center">
        <Image
          source={avatar}
          className="w-40 h-40 rounded-full"
        />
        <Text className="text-4xl font-bold mt-6">Sarah Woo</Text>
        <Text className="text-lg text-gray-600 mt-4">sarah@gmail.com</Text>
        <Text className="text-lg text-gray-600 mt-2">Waitress</Text>
        <CustomButton 
          text="Edit Profile"
          handlePress={handleEditProfile}
          containerStyles="mt-10 px-12"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

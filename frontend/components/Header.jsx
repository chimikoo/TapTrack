import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import arrowLeft from '../assets/icons/arrow-left.png';

const Header = () => {
  const navigation = useNavigation();

  return (
    <View className="w-full h-[8vh] flex justify-center items-start px-4 bg-primary-lighter">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={arrowLeft}
          resizeMode="contain"
          className="w-10 h-10"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

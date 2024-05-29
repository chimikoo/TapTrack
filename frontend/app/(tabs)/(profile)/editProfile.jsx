import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import InputField from '../../../components/InputField';
import CustomButton from '../../../components/CustomButton';

const EditProfile = () => {
  const [firstName, setFirstName] = useState('Sarah');
  const [lastName, setLastName] = useState('Smith');
  const [email, setEmail] = useState('sarah@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  return (
    <SafeAreaView className="flex-1 bg-primary-lighter justify-center items-center pt-16">
      <Text className="text-3xl font-bold mb-6">Edit Profile</Text>
      <View className="w-full space-y-4 items-center" >
        <InputField title="First Name" value={firstName} handleChange={setFirstName} />
        <InputField title="Last Name" value={lastName} handleChange={setLastName} />
        <InputField title="Email" value={email} handleChange={setEmail} />
        <InputField title="New Password" value={newPassword} handleChange={setNewPassword} />
        <InputField title="Confirm new password" value={confirmPassword} handleChange={setConfirmPassword} />
        <InputField title="Choose avatar" value={avatar} handleChange={setAvatar} />
        <CustomButton
          text="Update"
          containerStyles="w-[50%] mt-7"
          handlePress={() => {/* Logic for update here */}}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;

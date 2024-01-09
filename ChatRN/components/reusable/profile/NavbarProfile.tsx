import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../../../App';

type TProps = {
  navigation: NativeStackNavigationProp<RootNativeStackParamList, 'Profile'>;
};

const NavbarProfile = ({ navigation }: TProps) => {
  return (
    <View className="p-[30px] gap-4 border-b border-white/20">
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="py-2 px-4 bg-white/20 self-start rounded-md"
      >
        <Text className="text-white font-bold">Back</Text>
      </TouchableOpacity>
      <View>
        <Text className="text-white text-lg font-bold">Profile Setting</Text>
        <Text className="text-white/60">Edit your profile here</Text>
      </View>
    </View>
  );
};

export default NavbarProfile;

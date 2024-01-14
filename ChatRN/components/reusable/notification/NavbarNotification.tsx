import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../../../App';

const NavbarNotification = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  return (
    <View className="p-[30px] border-b border-white/20">
      <TouchableOpacity
        activeOpacity={0.8}
        className="py-2 px-4 bg-white/20 self-start rounded-md"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white font-bold">Back</Text>
      </TouchableOpacity>
      <Text className="font-bold text-white text-xl mt-4">Requested Chat</Text>
      <Text className="text-white/60 text-base mt-2">
        You can accept or block incoming chat request
      </Text>
    </View>
  );
};

export default NavbarNotification;

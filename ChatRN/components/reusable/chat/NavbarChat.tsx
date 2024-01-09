import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../../../App';

type Props = {
  name: string;
  username: string;
  profileImageUrl: string;
};

const NavbarChat = ({ name, username, profileImageUrl }: Props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  return (
    <View className="p-[30px] gap-6 border-b border-white/30">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => navigation.goBack()}
        className="py-2 px-4 bg-white/20 self-start rounded-md"
      >
        <Text className="text-white font-bold">Back</Text>
      </TouchableOpacity>
      <View className="flex flex-row items-center space-x-4">
        <View className="overflow-hidden rounded-full">
          <Image
            source={require('../../../assets/image/user.jpeg')}
            className="w-[60px] h-[60px]"
          />
        </View>

        <View>
          <Text className="text-2xl font-bold text-white">{name}</Text>
          <Text>{username}</Text>
        </View>
      </View>
    </View>
  );
};

export default NavbarChat;

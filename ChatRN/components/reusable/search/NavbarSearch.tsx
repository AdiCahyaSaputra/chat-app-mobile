import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import React, { useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../../../App';

type TProps = {
  navigation: NativeStackNavigationProp<RootNativeStackParamList, 'Search'>;
  setSearchInput: (value: React.SetStateAction<string>) => void;
};

const NavbarSearch = ({ navigation, setSearchInput }: TProps) => {
  const [searchText, setSearchText] = useState('');

  return (
    <View className="p-[30px] border-b border-white/20">
      <View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          className="py-2 px-4 bg-white/20 self-start rounded-md"
        >
          <Text className="text-white font-bold">Back</Text>
        </TouchableOpacity>

        <Text className="mt-4 text-xl font-bold text-white">
          Search Your Friends
        </Text>

        <Text className="text-white/60 text-base">
          Type your friend username here
        </Text>
      </View>
      <View className="flex flex-row items-center mt-4 border border-white rounded-md">
        <Text className="p-2 rounded-l-md bg-white/20 text-white">{'@'}</Text>
        <TextInput
          className="px-2 py-0 h-max flex-1"
          placeholder="username.."
          onChangeText={text => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          className="p-2 rounded-r-md bg-yellow-500/20"
          onPress={() => setSearchInput(searchText)}
        >
          <Image
            source={require('../../../assets/icon/UserSearchIcon.png')}
            className="w-4 h-4"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NavbarSearch;

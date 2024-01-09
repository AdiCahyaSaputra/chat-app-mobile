import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useAuth } from '../../../lib/hooks/auth';
import { useUserStore } from '../../../lib/zustand/userStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../../../App';
import ProfileImage from '../../reusable/global/ProfileImage';

const Profile = () => {
  const { logout } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const user = useUserStore(state => state.user);

  const handleLogout = () => {
    logout();
    console.log('Logout kepencet');
  };

  return (
    <View className="flex gap-4">
      <TouchableOpacity
        activeOpacity={0.8}
        className="py-2 px-4 bg-red-600/20 rounded-md self-start"
        onPress={() => handleLogout()}
      >
        <Text className="text-red-600 font-bold">Logout</Text>
      </TouchableOpacity>
      <View className="flex flex-row items-start justify-between mt-4">
        <View className="flex flex-row space-x-2 items-center">
          <View className="rounded-md overflow-hidden">
            <ProfileImage
              profile_image_url={user?.profile_image_url}
              width={45}
              height={45}
            />
          </View>
          <View>
            <Text className="text-white text-lg font-bold">
              {'@' + user?.username}
            </Text>
            <Text className="font-bold">{user?.name}</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.8}
          className="p-2 bg-white rounded-md self-start flex flex-row space-x-2 items-center"
        >
          <Image
            source={require('../../../assets/icon/EditProfileIcon.png')}
            className="w-4 h-4"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

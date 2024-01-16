import { View, Text, TouchableOpacity, Image } from 'react-native';
import ProfileImage from '../global/ProfileImage';
import React, { useState, useEffect } from 'react';
import { TSearchData } from '../../../lib/interface/response/ISearchResponse';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../../../App';
import RNSecureStorage from 'rn-secure-storage';
import axios from '../../../lib/helper/axios.helper';
import IBaseResponse from '../../../lib/interface/response/IBaseReponse';
import { useUserStore } from '../../../lib/zustand/userStore';
import { getStatus } from '../../../lib/helper/search.helper';

const getAddFriendIcon = (status: TStatus) => {
  const icon: { [key in typeof status]: any } = {
    idle: require('../../../assets/icon/AddFriendIcon.png'),
    loading: require('../../../assets/icon/AddFriendLoaderIcon.png'),
    error: require('../../../assets/icon/AddFriendErrorIcon.png'),
    success: require('../../../assets/icon/AddFriendSuccessIcon.png'),
  };

  return icon[status];
};

const getBgIcon = (status: TStatus) => {
  const bg: { [key in typeof status]: string } = {
    idle: 'bg-yellow-500/20',
    loading: 'bg-white/20',
    error: 'bg-red-600/20',
    success: 'bg-green-500/20',
  };

  return bg[status];
};

type TStatus = 'idle' | 'loading' | 'error' | 'success';

const FriendCard = ({ profile_image_url, username, name }: TSearchData) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const { friends, user, setRefetchFriends, refetchFriends } = useUserStore(
    state => state,
  );

  const [status, setStatus] = useState<TStatus>('idle');

  const handleAddFriend = async () => {
    setStatus('loading');

    try {
      const token = await RNSecureStorage.getItem('token');

      if (!token) {
        return navigation.navigate('Login');
      }

      const response = await axios.post(
        '/api/v1/friends',
        {
          username,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if ((response.data as IBaseResponse).message !== 'ok') {
        setStatus('error');
      }

      setStatus('success');
    } catch (err) {
      console.log(err);
      setStatus('error');
    }

    setRefetchFriends(!refetchFriends);
  };

  useEffect(() => {
    setStatus(getStatus(username, friends, user));
  }, [username]);

  return (
    <View className="flex flex-row justify-between items-center">
      <View className="flex flex-row space-x-4 items-start">
        <View className="rounded-md overflow-hidden">
          <ProfileImage
            profile_image_url={profile_image_url}
            width={40}
            height={40}
          />
        </View>
        <View>
          <Text className="text-white font-bold">{'@' + username}</Text>
          <Text className="text-white/60 mt-px">{name}</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        disabled={status === 'success' || status === 'error'}
        className={`p-2 ${getBgIcon(status)} rounded-md`}
        onPress={() => handleAddFriend()}
      >
        <Image source={getAddFriendIcon(status)} className="w-4 h-4" />
      </TouchableOpacity>
    </View>
  );
};

export default FriendCard;

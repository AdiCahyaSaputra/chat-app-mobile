import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNativeStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TContactsData } from '../../../lib/interface/response/IContactsResponse';
import ProfileImage from '../../reusable/global/ProfileImage';
import RNSecureStorage from 'rn-secure-storage';
import axios from '../../../lib/helper/axios.helper';
import IBaseResponse from '../../../lib/interface/response/IBaseReponse';
import { useNotificationStore } from '../../../lib/zustand/notificationStore';
import { useUserStore } from '../../../lib/zustand/userStore';

const ChatCard = ({
  room_id,
  contact_id,
  contact_name,
  contact_profile_image,
  latest_message,
}: TContactsData) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const [isLoadingAccept, setIsLoadingAccept] = useState(false);
  const [isLoadingBlock, setIsLoadingBlock] = useState(false);

  const { setRefetch, refetch } = useNotificationStore(state => state);
  const { refetchFriends, setRefetchFriends } = useUserStore();

  const handleAccept = async () => {
    setIsLoadingAccept(true);

    try {
      const token = await RNSecureStorage.getItem('token');

      if (!token) {
        setIsLoadingAccept(false);
        return navigation.push('Login');
      }

      const response = await axios.post(
        '/api/v1/chat/request/accept',
        {
          contact_user_id: contact_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if ((response.data as IBaseResponse).message === 'ok') {
        setRefetch(!refetch);
        setIsLoadingAccept(false);
      }
    } catch (err) {
      console.log(err);
    }

    setRefetchFriends(!refetchFriends);
    setIsLoadingAccept(false);
  };

  const handleBlock = async () => {
    setIsLoadingBlock(true);

    try {
      const token = await RNSecureStorage.getItem('token');

      if (!token) {
        setIsLoadingBlock(false);
        return navigation.push('Login');
      }

      const response = await axios.post(
        '/api/v1/chat/request/block/' + room_id,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if ((response.data as IBaseResponse).message === 'ok') {
        setRefetch(!refetch);
        setIsLoadingBlock(false);
      }
    } catch (err) {
      console.log(err);
    }

    setRefetchFriends(!refetchFriends);
    setIsLoadingBlock(false);
  };

  return (
    <View>
      <View className="flex flex-row items-center gap-4">
        <View className="rounded-md overflow-hidden">
          <ProfileImage
            profile_image_url={contact_profile_image}
            width={40}
            height={40}
          />
        </View>
        <View className="grow">
          <Text className="font-bold text-white">{contact_name}</Text>
          <Text className="text-sm">
            {latest_message ? latest_message.content : 'No chat yet'}
          </Text>
        </View>
        <View className="flex flex-row items-center space-x-2">
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isLoadingAccept || isLoadingBlock}
            className={`p-2 
            ${isLoadingAccept ? 'bg-green-600/10' : 'bg-green-600/20'} 
            rounded-md`}
            onPress={() => handleAccept()}
          >
            <Image
              source={require('../../../assets/icon/AcceptIcon.png')}
              className="w-5 h-5"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isLoadingAccept || isLoadingBlock}
            className={`p-2 
            ${isLoadingBlock ? 'bg-red-600/10' : 'bg-red-600/20'} 
            rounded-md`}
            onPress={() => handleBlock()}
          >
            <Image
              source={require('../../../assets/icon/BlockIcon.png')}
              className="w-5 h-5"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatCard;

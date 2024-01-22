import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNativeStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TContactsData } from '../../../lib/interface/response/IContactsResponse';
import ProfileImage from '../../reusable/global/ProfileImage';
import RNSecureStorage from 'rn-secure-storage';
import axios from '../../../lib/helper/axios.helper';

const ContactsCard = ({
  room_id,
  status,
  contact_id,
  contact_name,
  contact_username,
  contact_profile_image,
  latest_message,
  unread_messages,
}: TContactsData) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const readAllMessage = async () => {
    try {
      const token = await RNSecureStorage.getItem('token');

      if (!token) {
        return navigation.push('Login');
      }

      const response = await axios.put(
        `/api/v1/chat/message/${room_id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        readAllMessage();
        navigation.navigate('Chat/Username', {
          room_id,
          status,
          contact_id,
          contact_name,
          contact_username,
          contact_profile_image,
          unread_messages,
        });
      }}
    >
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
        {unread_messages > 0 && (
          <View className="py-1 px-2 bg-red-500 flex justify-center items-center rounded-full">
            <Text className="text-xs text-white">{unread_messages}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ContactsCard;

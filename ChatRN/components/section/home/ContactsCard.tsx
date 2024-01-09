import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNativeStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TContactsData } from '../../../lib/interface/response/IContactsResponse';
import ProfileImage from '../../reusable/global/ProfileImage';

const ContactsCard = ({
  contact_name,
  contact_user_id,
  contact_username,
  contact_profile_image,
  latest_message,
  latest_message_timestamp,
}: TContactsData) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('Chat/Username', {
          username: contact_username,
          name: contact_name,
        })
      }
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
          <Text className="text-sm">{latest_message ?? 'No chat yet'}</Text>
        </View>
        {(latest_message?.length || 0) > 0 && (
          <View className="py-1 px-2 bg-red-500 flex justify-center items-center rounded-full">
            <Text className="text-xs text-white">{latest_message?.length}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ContactsCard;

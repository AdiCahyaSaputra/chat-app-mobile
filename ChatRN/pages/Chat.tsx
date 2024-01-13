import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavbarChat from '../components/reusable/chat/NavbarChat';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';
import { FlatList } from 'react-native';
import MessageBubble from '../components/reusable/chat/MessageBubble';
import ChatInput from '../components/reusable/chat/ChatInput';
import { TGetMessageData } from '../lib/interface/response/IGetMessageResponse';
import RNSecureStorage from 'rn-secure-storage';
import axios from '../lib/helper/axios.helper';
import { useMessagesStore } from '../lib/zustand/messagesStore';

const Chat = ({
  navigation,
  route,
}: NativeStackScreenProps<RootNativeStackParamList, 'Chat/Username'>) => {
  const { messages, setMessages, refetch, setRefetch } = useMessagesStore(
    state => state,
  );

  useEffect(() => {
    const getMessages = async () => {
      try {
        const token = await RNSecureStorage.getItem('token');

        if (!token) {
          return navigation.push('Login');
        }

        const response = await axios.get(
          `/api/v1/chat/message/${route.params.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setMessages(response.data.data as TGetMessageData[] | []);
        console.log(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    getMessages();
  }, [route.params.username, refetch]);

  return (
    <SafeAreaView className="flex-1 dark:bg-black">
      <NavbarChat
        username={route.params.username}
        name={route.params.name}
        profileImageUrl={route.params.profile_image_url}
      />

      <FlatList
        className="p-[30px]"
        data={messages}
        renderItem={({ item: message }) => <MessageBubble {...message} />}
        keyExtractor={(_, idx) => idx.toString()}
        contentContainerStyle={containerStyle}
        inverted
      />

      <ChatInput
        setRefetch={setRefetch}
        receiver_id={route.params.id}
        refetch={refetch}
      />
    </SafeAreaView>
  );
};

const containerStyle = {
  gap: 10,
  flexDirection: 'column-reverse',
};

export default Chat;

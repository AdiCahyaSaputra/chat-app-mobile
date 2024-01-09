import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavbarChat from '../components/reusable/chat/NavbarChat';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';
import { FlatList } from 'react-native';
import MessageBubble from '../components/reusable/chat/MessageBubble';
import ChatInput from '../components/reusable/chat/ChatInput';

const messages = [
  {
    sender: '@jane',
    message: 'Hello World',
    date: '08:13 AM',
  },
  {
    sender: '@adicss',
    message: 'p bre',
    date: '08:13 AM',
  },
];

const Chat = ({
  route,
}: NativeStackScreenProps<RootNativeStackParamList, 'Chat/Username'>) => {
  return (
    <SafeAreaView className="flex-1 dark:bg-black">
      <NavbarChat
        username={route.params.username}
        name={route.params.name}
        profileImageUrl="../assets/image/user.jpeg"
      />

      <FlatList
        className="p-[30px]"
        data={messages}
        renderItem={({ item: message }) => <MessageBubble {...message} />}
        keyExtractor={(_, idx) => idx.toString()}
      />

      <ChatInput />
    </SafeAreaView>
  );
};

export default Chat;

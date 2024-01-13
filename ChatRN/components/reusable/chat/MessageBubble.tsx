import { View, Text } from 'react-native';
import React from 'react';
import { useUserStore } from '../../../lib/zustand/userStore';
import ProfileImage from '../global/ProfileImage';

type Props = {
  sender: string;
  message: string;
  date: string;
  profile_image_url: string | null;
};

const colorClass = { me: 'bg-white/30', other: 'bg-white/10' };
const alignClass = { me: 'self-end', other: 'self-start' };
const roundedClass = {
  me: 'rounded-xl rounded-tr-none',
  other: 'rounded-xl rounded-tl-none',
};

const dateClass = {
  me: 'text-right',
  other: 'text-left',
};

const getSenderClass = (
  sender: string,
  current_user: string,
  className: { me: string; other: string },
) => {
  return sender === current_user ? className.me : className.other;
};

const messageBubbleClass = (sender: string, current_user: string) =>
  getSenderClass(sender, current_user, colorClass) +
  ' ' +
  getSenderClass(sender, current_user, roundedClass);

const MessageBubble = ({ sender, message, date, profile_image_url }: Props) => {
  const user = useUserStore(state => state.user);
  const current_user = `@${user?.username}`;

  return (
    <View
      className={`${getSenderClass(
        sender,
        current_user,
        alignClass,
      )} flex flex-row items-start space-x-4`}
    >
      {sender !== current_user && (
        <View className="rounded-md overflow-hidden">
          <ProfileImage
            width={40}
            height={40}
            profile_image_url={profile_image_url}
          />
        </View>
      )}
      <View>
        {sender !== current_user && (
          <Text className="font-bold mb-1">{sender}</Text>
        )}

        <View
          className={`py-2 px-4 ${messageBubbleClass(sender, current_user)}`}
        >
          <Text>{message}</Text>
        </View>
        <Text
          className={`text-xs mt-2 ${getSenderClass(
            sender,
            current_user,
            dateClass,
          )}`}
        >
          {date}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;

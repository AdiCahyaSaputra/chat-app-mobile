import { View, Text, Image } from 'react-native';
import React from 'react';

type Props = {
  sender: string;
  message: string;
  date: string;
};

const colorClass = { me: 'bg-white/30', other: 'bg-white/10' };
const alignClass = { me: 'self-end', other: 'self-start' };
const roundedClass = {
  me: 'rounded-xl rounded-tr-none',
  other: 'rounded-xl rounded-tl-none',
};

const dateClass = {
  me: 'text-left',
  other: 'text-right',
};

const getSenderClass = (
  sender: string,
  className: { me: string; other: string },
) => (sender === '@adicss' ? className.me : className.other);

const messageBubbleClass = (sender: string) =>
  getSenderClass(sender, colorClass) +
  ' ' +
  getSenderClass(sender, roundedClass);

const MessageBubble = ({ sender, message, date }: Props) => {
  return (
    <View
      className={`${getSenderClass(
        sender,
        alignClass,
      )} flex flex-row items-start space-x-4`}
    >
      {sender !== '@adicss' && (
        <Image
          className="w-[40px] h-[40px] rounded-full"
          source={require('../../../assets/image/user.jpeg')}
        />
      )}
      <View>
        {sender !== '@adicss' && (
          <Text className="font-bold mb-1">{sender}</Text>
        )}

        <View className={`py-2 px-4 ${messageBubbleClass(sender)}`}>
          <Text>{message}</Text>
        </View>
        <Text className={`text-xs mt-2 ${getSenderClass(sender, dateClass)}`}>
          {date}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;

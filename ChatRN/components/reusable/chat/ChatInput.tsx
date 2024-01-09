import { View, Image, TextInput, TouchableHighlight } from 'react-native';
import React, { useState } from 'react';

const ChatInput = () => {
  const [input, setInput] = useState('');

  return (
    <View className="px-[30px] py-[20px] flex flex-row justify-between bg-black border-t border-white/20">
      <View className="flex flex-row space-x-4 items-center">
        <Image
          source={require('../../../assets/icon/SmileIcon.png')}
          className="w-[20px] h-[20px]"
        />
        <TextInput
          className="h-max p-0 border-none"
          onChangeText={setInput}
          value={input}
          placeholder="Reply.."
        />
      </View>
      <View className="flex flex-row items-center space-x-4">
        <Image
          source={require('../../../assets/icon/AddImage.png')}
          className="w-[20px] h-[20px]"
        />
        <TouchableHighlight
          className="p-2 bg-white/60 rounded-full active:bg-white/30"
          activeOpacity={0.8}
          underlayColor={'#1f2937'}
        >
          <Image
            source={require('../../../assets/icon/SendIcon.png')}
            className="w-[20px] h-[20px]"
          />
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default ChatInput;

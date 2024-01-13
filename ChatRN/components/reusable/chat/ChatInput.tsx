import { View, Image, TextInput, TouchableHighlight } from 'react-native';
import React, { useState } from 'react';
import RNSecureStorage from 'rn-secure-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../../../App';
import axios from '../../../lib/helper/axios.helper';

type TProps = {
  setRefetch: (value: React.SetStateAction<boolean>) => void;
  receiver_id: number;
  refetch: boolean;
};

const ChatInput = ({ setRefetch, receiver_id, refetch }: TProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input === '') {
      return;
    }

    setIsLoading(true);

    try {
      const token = await RNSecureStorage.getItem('token');

      if (!token) {
        setIsLoading(false);
        return navigation.push('Login');
      }

      const response = await axios.post(
        '/api/v1/chat/message',
        {
          message_content: input,
          receiver_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.data) {
        setRefetch(!refetch);
        setInput('');
      }

      setIsLoading(false);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }

    setIsLoading(false);
  };

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
          className={`p-2 rounded-full active:bg-white/30 
          ${input === '' ? 'bg-white/20' : 'bg-white/40 '}`}
          activeOpacity={0.8}
          underlayColor={'#1f2937'}
          disabled={input === '' || isLoading}
          onPress={() => handleSendMessage()}
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

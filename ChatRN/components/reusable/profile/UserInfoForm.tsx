import { View, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import React, { useMemo, useState } from 'react';
import axios from '../../../lib/helper/axios.helper';
import RNSecureStorage from 'rn-secure-storage';
import { useNavigation } from '@react-navigation/native';
import { RootNativeStackParamList } from '../../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import IUpdateProfileResponse, {
  TUpdateValidationMessage,
} from '../../../lib/interface/response/IUpdateProfileResponse';
import { useUserStore } from '../../../lib/zustand/userStore';
import { useAuth } from '../../../lib/hooks/auth';

const UserInfoForm = () => {
  const user = useUserStore(state => state.user);
  const { getUser } = useAuth();

  const [newInput, setNewInput] = useState({
    name: user?.name,
    username: user?.username,
  });

  const [error, setError] = useState<TUpdateValidationMessage>({});
  const [isLoading, setIsLoading] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const isUserInfoChange = useMemo(
    () => newInput.name === user?.name && newInput.username === user?.username,
    [newInput, user],
  );

  const handleUpdate = async () => {
    const token = await RNSecureStorage.getItem('token');

    if (!token) {
      return navigation.navigate('Login');
    }

    setIsLoading(true);

    const updateData: { name?: string; username?: string } = {};

    if (newInput.name !== user?.name) {
      updateData.name = newInput.name;
    }

    if (newInput.username !== user?.username) {
      updateData.username = newInput.username;
    }

    const response = await axios.put('/api/v1/profile', updateData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data as IUpdateProfileResponse;

    console.log(data);

    if (data.message !== 'ok') {
      setError(data.message);
      setIsLoading(false);
    }

    if (!(data.data instanceof Array)) {
      getUser()
        .then(userResponse => {
          if (userResponse) {
            setUser(userResponse);
          }

          setIsLoading(false);
        })
        .catch(_ => {
          setIsLoading(false);
          navigation.navigate('Login');
        });
    }
  };

  return (
    <View className="mt-10">
      <Text className="text-lg font-bold text-white">User Info</Text>
      <View className="mt-4 space-y-2">
        <View>
          <Text>Your Name</Text>
          <TextInput
            placeholder="Your Name"
            value={newInput.name}
            onChangeText={text =>
              setNewInput({
                ...newInput,
                name: text,
              })
            }
            className="p-0 h-max border-b border-white/60"
          />
          {error.name && (
            <View className="mt-2 bg-red-600/20 rounded-md py-1 px-2">
              {error.name.map((errorMessage, idx) => (
                <Text key={idx} className="text-red-600">
                  {errorMessage}
                </Text>
              ))}
            </View>
          )}
        </View>

        <View>
          <Text>Unique Username</Text>
          <View className="flex flex-row space-x-2 items-center">
            <Text>{'@'}</Text>
            <TextInput
              onChangeText={text =>
                setNewInput({
                  ...newInput,
                  username: text,
                })
              }
              placeholder="Unique Username"
              value={newInput.username}
              className="p-0 h-max border-b border-white/60 flex-1"
            />
          </View>
          {error.username && (
            <View className="mt-2 bg-red-600/20 rounded-md py-1 px-2">
              {error.username.map((errorMessage, idx) => (
                <Text key={idx} className="text-red-600">
                  {errorMessage}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isUserInfoChange || isLoading}
        onPress={() => handleUpdate()}
        className={`mt-4 ${
          isUserInfoChange ? 'bg-white/60' : 'bg-white'
        } py-2 px-4 rounded-md flex flex-row space-x-2 items-center justify-between`}
      >
        <Text className="text-black font-bold">
          {isLoading ? 'Loading...' : 'Edit This User Info'}
        </Text>
        <Image
          source={require('../../../assets/icon/EditProfileIcon.png')}
          className="w-5 h-5"
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserInfoForm;

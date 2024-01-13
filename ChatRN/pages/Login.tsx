import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';
import { useAuth } from '../lib/hooks/auth';
import { getDeviceId } from 'react-native-device-info';
import { TLoginValidationMessage } from '../lib/interface/response/ILoginResponse';
import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage';
import { useUserStore } from '../lib/zustand/userStore';

const Login = ({
  navigation,
}: NativeStackScreenProps<RootNativeStackParamList, 'Login'>) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<TLoginValidationMessage>({});

  const { login } = useAuth();
  const setUser = useUserStore(state => state.setUser);

  const handleLogin = () => {
    login(
      {
        username,
        password,
        device_name: `${username}, ${getDeviceId()}`,
      },
      {
        onSuccess: response => {
          if (!(response.data instanceof Array)) {
            setUser(response.data.user);

            RNSecureStorage.setItem('token', response.data.token, {
              accessible: ACCESSIBLE.WHEN_UNLOCKED,
            })
              .then(res => {
                console.log('Set Token storage : ', res);
                navigation.push('Home');
              })
              .catch(err => console.error('Set Token storage : ', err));
          }

          if (response.message !== 'ok') {
            setError(response.message);
          }
        },
        onError: err => {
          console.log(err);
        },
      },
    );
  };

  return (
    <SafeAreaView className="flex-1 dark:bg-black">
      <View className="flex flex-1 justify-center items-center">
        <View>
          <Text className="text-2xl font-bold text-white">Login 👀</Text>

          <View className="mt-4 space-y-2">
            <View>
              <TextInput
                placeholder="Username"
                textContentType="username"
                className="py-1.5 h-max border-none border-b-2  border-white/40"
                onChangeText={text => setUsername(text)}
                value={username}
              />
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

            <View>
              <TextInput
                placeholder="Password"
                textContentType="password"
                secureTextEntry
                className="py-1.5 h-max border-none border-b-2  border-white/40"
                onChangeText={text => setPassword(text)}
                value={password}
              />
              {error.password && (
                <View className="mt-2 bg-red-600/20 rounded-md py-1 px-2">
                  {error.password.map((errorMessage, idx) => (
                    <Text key={idx} className="text-red-600">
                      {errorMessage}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            className="py-2 px-4 bg-white mt-4 rounded-md active:bg-white/80"
            activeOpacity={0.8}
            onPress={() => handleLogin()}
          >
            <Text className="text-black text-center font-bold">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2 px-4 bg-transparent mt-4 border-2 border-white/60 rounded-md active:border-white/80"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Register')}
          >
            <Text className="text-white text-center font-bold">
              Belum Punya Akun?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

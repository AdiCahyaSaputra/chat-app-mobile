import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';
import { useAuth } from '../lib/hooks/auth';
import { TRegisterValidationMessage } from '../lib/interface/response/IRegisterResponse';

const Register = ({
  navigation,
}: NativeStackScreenProps<RootNativeStackParamList, 'Register'>) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [error, setError] = useState<TRegisterValidationMessage>({});

  const { register } = useAuth();

  const handleRegister = () => {
    register(
      {
        name,
        username,
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onSuccess: response => {
          if (response.message === 'ok') {
            navigation.navigate('Login');
          } else {
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
          <Text className="text-2xl font-bold text-white">Register 💕</Text>

          <View className="mt-4 space-y-2">
            <View>
              <TextInput
                placeholder="Nama"
                textContentType="name"
                className="py-1.5 h-max border-none border-b-2  border-white/40"
                onChangeText={text => setName(text)}
                autoCapitalize="words"
                value={name}
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

            <View>
              <TextInput
                placeholder="Konfirmasi Password"
                textContentType="password"
                secureTextEntry
                className="py-1.5 h-max border-none border-b-2  border-white/40"
                onChangeText={text => setPasswordConfirmation(text)}
                value={passwordConfirmation}
              />
              {error.password_confirmation && (
                <View className="mt-2 bg-red-600/20 rounded-md py-1 px-2">
                  {error.password_confirmation.map((errorMessage, idx) => (
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
            onPress={() => handleRegister()}
          >
            <Text className="text-black text-center font-bold">Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="py-2 px-4 bg-transparent mt-4 border-2 border-white/60 rounded-md active:border-white/80"
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text className="text-white text-center font-bold">
              Udah Punya Akun?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;

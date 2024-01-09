import { View, Image, Text, TouchableOpacity, Platform } from 'react-native';
import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavbarProfile from '../components/reusable/profile/NavbarProfile';
import UploadProfilePicture from '../components/reusable/profile/UploadProfilePicture';
import { useUserStore } from '../lib/zustand/userStore';
import UserInfoForm from '../components/reusable/profile/UserInfoForm';
import axios from '../lib/helper/axios.helper';
import { DocumentPickerResponse } from 'react-native-document-picker';
import RNSecureStorage from 'rn-secure-storage';
import IBaseResponse from '../lib/interface/response/IBaseReponse';
import { useAuth } from '../lib/hooks/auth';

const Profile = ({
  navigation,
}: NativeStackScreenProps<RootNativeStackParamList, 'Profile'>) => {
  const { user, setUser } = useUserStore(state => state);
  const { getUser } = useAuth();

  const [file, setFile] = useState<DocumentPickerResponse[] | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadImage = async () => {
    setIsLoading(true);

    if (file) {
      try {
        const token = await RNSecureStorage.getItem('token');

        if (!token) {
          setIsLoading(false);
          return navigation.navigate('Login');
        }

        const data = new FormData();

        data.append('image', {
          uri:
            Platform.OS === 'ios'
              ? file[0].uri.replace('file://', '')
              : file[0].uri,
          name: file[0].name,
          type: file[0].type,
        });

        console.log(data);

        const response = await axios.post('/api/v1/profile-image', data, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });

        if ((response.data as IBaseResponse).message === 'ok') {
          setIsLoading(false);
          setFile(null);
          getUser().then(userResponse => {
            if (userResponse) {
              setUser(userResponse);
            }
          });
        }
      } catch (err) {
        setIsLoading(false);
        console.log(err, 'Axios error bre bukan laravel');
      }

      setIsLoading(false);
    }
  };

  const handleDestroyProfileImage = async () => {
    setIsLoading(true);

    try {
      const token = await RNSecureStorage.getItem('token');

      if (!token) {
        setIsLoading(false);

        return navigation.navigate('Login');
      }

      const response = await axios.delete('/api/v1/profile-image', {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      if ((response.data as IBaseResponse).message === 'ok') {
        getUser().then(userResppnse => {
          if (userResppnse) {
            setUser(userResppnse);
          }
        });
      }

      setIsLoading(false);
    } catch (err) {
      console.log(err);

      setIsLoading(false);
    }

    setConfirmDialog(false);
    setIsLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 dark:bg-black relative">
      <NavbarProfile navigation={navigation} />
      <View className="p-[30px]">
        <UploadProfilePicture
          imageUrl={user?.profile_image_url}
          setFile={setFile}
          setConfirmDialog={setConfirmDialog}
        />
        <UserInfoForm />
      </View>

      {file && (
        <View className="absolute left-0 top-0 right-0 bottom-0 bg-black/80 flex-1 flex justify-center items-center z-[99]">
          <View className="p-4 border border-white rounded-md bg-black">
            <Image
              source={{
                uri: file[0].uri,
              }}
              className="w-[200px] h-[200px]"
            />

            <View className="space-y-2 mt-4">
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={isLoading}
                className={`py-2 px-4 
                ${isLoading ? 'bg-white/80' : 'bg-white'} rounded-md`}
                onPress={() => handleUploadImage()}
              >
                <Text className="text-black font-bold">
                  {isLoading ? 'Loading...' : 'Upload It'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                className="py-2 px-4 bg-red-600/20 rounded-md"
                onPress={() => setFile(null)}
              >
                <Text className="text-red-600 font-bold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {confirmDialog && (
        <View className="absolute left-0 top-0 right-0 bottom-0 bg-black/80 flex-1 flex justify-center items-center z-[99]">
          <View className="p-4 border border-white rounded-md bg-black">
            <Text className="text-white font-bold">Are You Sure?</Text>
            <Text>Deleted image {"can't"} be restored</Text>

            <View className="flex flex-row items-center mt-4 space-x-2">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDestroyProfileImage()}
                className={`py-2 px-4 ${
                  isLoading ? 'bg-red-600/10' : 'bg-red-600/20'
                } rounded-md`}
              >
                <Text className="text-red-600">
                  {isLoading ? 'Loading...' : 'I know'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setConfirmDialog(false)}
                className="py-2 px-4 bg-white/20 rounded-md"
              >
                <Text className="text-white">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;

import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Seperator from '../components/reusable/global/Seperator';
import Profile from '../components/section/home/Profile';
import ContactsCard from '../components/section/home/ContactsCard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';
import { useUserStore } from '../lib/zustand/userStore';
import IContactsResponse from '../lib/interface/response/IContactsResponse';
import axios from '../lib/helper/axios.helper';
import RNSecureStorage from 'rn-secure-storage';

const Home = ({
  navigation,
}: NativeStackScreenProps<RootNativeStackParamList, 'Home'>) => {
  const { user, friends, setFriends } = useUserStore(state => state);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const token = await RNSecureStorage.getItem('token');

        if (!token) {
          return navigation.navigate('Login');
        }

        const response = await axios.get('/api/v1/chat/contacts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if ((response.data as IContactsResponse).message !== 'ok') {
          console.log(response.data.message);
        }

        console.log(response.data.data);
        setFriends(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    getContacts();
  }, [user]);

  return (
    <SafeAreaView className="flex-1 dark:bg-black">
      {user ? (
        <View className="p-[30px] flex-1">
          <Profile />
          <Seperator customClass="mt-6 bg-white/30" />

          <Text className="mt-6 mb-2 text-white font-bold text-lg">
            Friends
          </Text>
          {friends.length ? (
            <FlatList
              data={friends}
              renderItem={({ item: friend }) => <ContactsCard {...friend} />}
              keyExtractor={(_, idx) => idx.toString()}
              contentContainerStyle={containerStyle}
            />
          ) : (
            <View className="flex-1">
              <Text>You have no friends</Text>
            </View>
          )}
          <View>
            <TouchableOpacity
              activeOpacity={0.8}
              className="bg-yellow-500/20 py-2 px-4 rounded-md flex flex-row items-center justify-between"
              onPress={() => navigation.navigate('Search')}
            >
              <Text className="text-yellow-500 font-bold">
                Looking for friends?
              </Text>
              <Image
                source={require('../assets/icon/LookForFriendIcon.png')}
                className="w-5 h-5"
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex flex-1 justify-center items-center">
          <View>
            <Text className="text-2xl font-bold text-white">
              Kamu Belum Login
            </Text>
            <Text>Login/Register dulu yuk 😋</Text>

            <View className="flex flex-row mt-4 space-x-2">
              <TouchableOpacity
                className="py-2 px-4 bg-white rounded-md"
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Login')}
              >
                <Text className="text-black font-bold">Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="py-2 px-4 bg-transparent border-2 border-white/70 rounded-md"
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate('Register');
                  console.log('ke pencet');
                }}
              >
                <Text className="font-bold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const containerStyle = {
  gap: 10,
};

export default Home;

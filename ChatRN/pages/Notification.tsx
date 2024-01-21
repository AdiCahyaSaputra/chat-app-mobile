import { View, Text, FlatList } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavbarNotification from '../components/reusable/notification/NavbarNotification';
import ChatCard from '../components/reusable/notification/ChatCard';
import { useNotificationStore } from '../lib/zustand/notificationStore';
import RNSecureStorage from 'rn-secure-storage';
import axios from '../lib/helper/axios.helper';
import { useUserStore } from '../lib/zustand/userStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';

const Notification = () => {
  const { notifications, setNotifications, refetch } = useNotificationStore(
    state => state,
  );

  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const user = useUserStore(state => state.user);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const token = await RNSecureStorage.getItem('token');

        if (!token) {
          return navigation.navigate('Login');
        }

        const response = await axios.get('/api/v1/chat/request', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setNotifications(response.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    getNotifications();
  }, [refetch, user]);

  return (
    <SafeAreaView className="flex-1 dark:bg-black">
      <NavbarNotification />
      <View className="p-[30px]">
        <FlatList
          data={notifications}
          renderItem={({ item: notification }) => (
            <ChatCard {...notification} />
          )}
          keyExtractor={(_, idx) => idx.toString()}
          ListEmptyComponent={
            <View className="flex-1">
              <Text>No requested chat</Text>
            </View>
          }
          contentContainerStyle={containerStyle}
        />
      </View>
    </SafeAreaView>
  );
};

const containerStyle = {
  gap: 10,
};

export default Notification;

import { View, FlatList, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootNativeStackParamList } from '../App';
import NavbarSearch from '../components/reusable/search/NavbarSearch';
import FriendCard from '../components/reusable/search/FriendCard';
import RNSecureStorage from 'rn-secure-storage';
import ISearchResponse, {
  TSearchData,
} from '../lib/interface/response/ISearchResponse';
import axios from '../lib/helper/axios.helper';

const Search = ({
  navigation,
}: NativeStackScreenProps<RootNativeStackParamList, 'Search'>) => {
  const [searchInput, setSearchInput] = useState('');
  const [data, setData] = useState<TSearchData[] | []>([]);

  useEffect(() => {
    if (searchInput) {
      const getData = async () => {
        const token = await RNSecureStorage.getItem('token');

        if (!token) {
          return navigation.navigate('Login');
        }

        try {
          const response = await axios.get(
            '/api/v1/friends/' + searchInput.toLowerCase(),
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          const contacts = response.data as ISearchResponse;

          if (contacts.message !== 'ok') {
            console.log('Contacts not found');
          } else {
            setData(contacts.data);
          }
        } catch (err) {
          console.log(err);
        }
      };

      getData();
    }
  }, [searchInput]);

  return (
    <SafeAreaView className="flex-1 dark:bg-black">
      <NavbarSearch setSearchInput={setSearchInput} navigation={navigation} />
      <View className="p-[30px] flex-1">
        {data.length ? (
          <FlatList
            data={data}
            renderItem={({ item }) => <FriendCard {...item} />}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={containerStyle}
          />
        ) : (
          <Text>No Results</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const containerStyle = {
  gap: 10,
};

export default Search;

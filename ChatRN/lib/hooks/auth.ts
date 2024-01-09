import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootNativeStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from '../helper/axios.helper';
import IRegisterRequest from '../interface/request/IRegisterRequest';
import ILoginRequest from '../interface/request/ILoginRequest';
import { useEffect } from 'react';

import RNSecureStorage from 'rn-secure-storage';
import IRegisterResponse from '../interface/response/IRegisterResponse';
import ILoginResponse from '../interface/response/ILoginResponse';
import IUser from '../interface/entities/IUser';
import { useUserStore } from '../zustand/userStore';

/**
  Hooks for authentication
**/
export const useAuth = () => {
  const route = useRoute<RouteProp<RootNativeStackParamList>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootNativeStackParamList>>();

  const setUser = useUserStore(state => state.setUser);

  const getUser = async (): Promise<IUser | null> => {
    const token = await RNSecureStorage.getItem('token');

    if (!token) {
      return null;
    }

    const response = await axios.get('/api/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  const register = async (
    request: IRegisterRequest,
    options?: {
      onSuccess?: (reponse: IRegisterResponse) => void;
      onError?: (error: any) => void;
    },
  ) => {
    try {
      const response = await axios.post('/api/v1/register', request);
      console.log(response.data);

      return options?.onSuccess?.(response.data);
    } catch (error) {
      return options?.onError?.(error);
    }
  };

  const login = async (
    request: ILoginRequest,
    options?: {
      onSuccess?: (reponse: ILoginResponse) => void;
      onError?: (error: any) => void;
    },
  ) => {
    try {
      const response = await axios.post('/api/v1/login', request);
      console.log(response.data);

      return options?.onSuccess?.(response.data);
    } catch (error) {
      return options?.onError?.(error);
    }
  };

  const logout = async () => {
    const token = await RNSecureStorage.getItem('token');

    axios
      .post(
        '/api/v1/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(async response => {
        console.log(response.data);

        RNSecureStorage.removeItem('token').then(responseDelete => {
          console.log(responseDelete);
          navigation.navigate('Login');
        });
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getUser()
      .then(user => {
        if (user) {
          setUser(user);
          console.log(user);
          console.log('user from useAuth');
        }
      })
      .catch(_ => {
        if (route.name !== 'Register') {
          navigation.navigate('Login');
        }
        console.log('error from useAuth');
      });
  }, []);

  return {
    getUser,
    register,
    login,
    logout,
  };
};

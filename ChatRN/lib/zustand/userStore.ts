import { create } from 'zustand';
import IUser from '../interface/entities/IUser';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TContactsData } from '../interface/response/IContactsResponse';

interface UserStore {
  user: IUser | null;
  setUser: (user: IUser) => void;
  friends: TContactsData[] | [];
  setFriends: (friends: TContactsData[] | []) => void;
  refetchFriends: boolean;
  setRefetchFriends: (refetchFriends: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    set => ({
      user: null,
      setUser: user => set({ user }),
      friends: [],
      setFriends: friends => set({ friends }),
      refetchFriends: false,
      setRefetchFriends: refetchFriends => set({ refetchFriends }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

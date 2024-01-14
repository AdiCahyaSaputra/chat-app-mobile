import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TContactsData } from '../interface/response/IContactsResponse';

interface NotifictaionStore {
  notifications: TContactsData[] | [];
  setNotifications: (notifications: TContactsData[] | []) => void;
  refetch: boolean;
  setRefetch: (refetch: boolean) => void;
}

export const useNotificationStore = create<NotifictaionStore>()(
  persist(
    set => ({
      notifications: [],
      setNotifications: notifications => set({ notifications }),
      refetch: false,
      setRefetch: refetch => set({ refetch }),
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

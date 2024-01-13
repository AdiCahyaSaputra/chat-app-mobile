import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TGetMessageData } from '../interface/response/IGetMessageResponse';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MessageStore {
  messages: TGetMessageData[] | [];
  setMessages: (messages: TGetMessageData[] | []) => void;
  refetch: boolean;
  setRefetch: (refetch: boolean) => void;
}

export const useMessagesStore = create<MessageStore>()(
  persist(
    set => ({
      messages: [],
      setMessages: messages => set({ messages }),
      refetch: false,
      setRefetch: refetch => set({ refetch }),
    }),
    {
      name: 'message-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

import { View } from 'react-native';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  customClass?: string;
};

const Seperator = ({ customClass }: Props) => {
  return <View className={twMerge('h-px dark:bg-white', customClass)} />;
};

export default Seperator;

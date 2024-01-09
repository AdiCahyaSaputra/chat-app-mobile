import { Image } from 'react-native';
import React from 'react';
import { BACKEND_URL } from '../../../lib/helper/axios.helper';

type TProps = {
  profile_image_url?: string | null;
  width?: number;
  height?: number;
};

const ProfileImage = ({ profile_image_url, width, height }: TProps) => {
  return (
    <Image
      source={
        profile_image_url
          ? { uri: `${BACKEND_URL}/${profile_image_url}` }
          : require('../../../assets/image/girl.png')
      }
      style={{
        width: width || 30,
        height: height || 30,
      }}
    />
  );
};

export default ProfileImage;

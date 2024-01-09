import { View, Text, Image, TouchableOpacity } from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import React from 'react';
import ProfileImage from '../global/ProfileImage';

type TProps = {
  imageUrl?: string | null;
  setFile: (
    value: React.SetStateAction<DocumentPickerResponse[] | null>,
  ) => void;
  setConfirmDialog: (value: React.SetStateAction<boolean>) => void;
};

const UploadProfilePicture = ({
  imageUrl,
  setFile,
  setConfirmDialog,
}: TProps) => {
  const handleUploadPreviewImage = async () => {
    try {
      const file = await DocumentPicker.pick({
        type: [types.images],
        allowMultiSelection: false,
      });

      console.log(file);

      setFile(file);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document Picker canceled');
      }

      console.log(err);
    }
  };

  return (
    <View className="flex flex-row items-start space-x-4">
      <ProfileImage profile_image_url={imageUrl} width={150} height={150} />
      <View className="flex-1 space-y-2">
        <Text className="font-bold text-white">Upload Image Rules</Text>
        <Text className="text-sm">Max 2MB and 500x500 is Recomended</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          className="p-2 bg-white/20 rounded-md flex flex-row space-x-2"
          onPress={() => handleUploadPreviewImage()}
        >
          <Image
            source={require('../../../assets/icon/UploadIcon.png')}
            className="w-5 h-5"
          />
          <Text className="text-white font-bold">Upload New Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!imageUrl}
          className={`p-2 ${
            imageUrl ? 'bg-red-600/20' : 'bg-red-600/10'
          } rounded-md flex flex-row space-x-2`}
          onPress={() => setConfirmDialog(true)}
        >
          <Image
            source={require('../../../assets/icon/TrashIcon.png')}
            className="w-5 h-5"
          />
          <Text
            className={`${
              imageUrl ? 'text-red-600' : 'text-red-600/50'
            } font-bold`}
          >
            Remove Image
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UploadProfilePicture;

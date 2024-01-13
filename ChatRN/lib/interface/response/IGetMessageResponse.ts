import IBaseResponse from './IBaseReponse';

export default interface IGetMessageResponse extends IBaseResponse {
  data: TGetMessageData[] | [];
}

export type TGetMessageData = {
  sender: string;
  message: string;
  date: string;
  profile_image_url: string | null;
};

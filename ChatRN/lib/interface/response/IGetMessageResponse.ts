import IBaseResponse from './IBaseReponse';

export default interface IGetMessageResponse extends IBaseResponse {
  data: TGetMessageData[] | [];
}

export type TGetMessageData = {
  room_id: number;
  is_blocked: boolean;
  sender: string;
  message_id: number;
  content: string;
  date: string;
  profile_image_url: string | null;
};

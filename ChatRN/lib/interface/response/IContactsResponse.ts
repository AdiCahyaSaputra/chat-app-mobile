import IBaseResponse from './IBaseReponse';

export default interface IContactsResponse extends IBaseResponse {
  data: TContactsData[] | [];
}

export type TContactsData = {
  room_id: number;
  status: 'request' | 'friend';
  contact_id: number;
  contact_name: string;
  contact_username: string;
  contact_profile_image: string | null;
  latest_message: {
    room_id: number;
    user_id: number;
    sender_id: number;
    content: string;
    is_read: boolean;
  } | null;
  unread_messages: number;
};

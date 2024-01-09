import IBaseResponse from './IBaseReponse';

export default interface IContactsResponse extends IBaseResponse {
  data: TContactsData[] | [];
}

export type TContactsData = {
  id: number;
  contact_user_id: number;
  contact_username: string;
  contact_name: string;
  contact_profile_image: string;
  latest_message: string | null;
  latest_message_timestamp: string | null;
};

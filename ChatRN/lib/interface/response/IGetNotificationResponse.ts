import IBaseResponse from './IBaseReponse';
import { TContactsData } from './IContactsResponse';

export default interface IGetNotificationResponse extends IBaseResponse {
  data: TContactsData[] | [];
}

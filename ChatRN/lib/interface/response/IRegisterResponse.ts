import IUser from '../entities/IUser';
import IBaseResponse from './IBaseReponse';

export default interface IRegisterResponse extends IBaseResponse {
  message: TRegisterValidationMessage | 'ok';
  data: IUser | [];
}

export type TRegisterValidationMessage = {
  name?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
};

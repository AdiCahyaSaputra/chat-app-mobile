import IUser from '../entities/IUser';
import IBaseResponse from './IBaseReponse';

export default interface ILoginResponse extends IBaseResponse {
  message: TLoginValidationMessage | 'ok';
  data: TData | [];
}

type TData = {
  token: string;
  user: IUser;
};

export type TLoginValidationMessage = {
  username?: string[];
  password?: string[];
};

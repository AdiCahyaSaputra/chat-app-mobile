import IBaseResponse from './IBaseReponse';

export default interface IUpdateProfileResponse extends IBaseResponse {
  message: TUpdateValidationMessage | 'ok';
  data: number | [];
}

export type TUpdateValidationMessage = {
  name?: string[];
  username?: string[];
};

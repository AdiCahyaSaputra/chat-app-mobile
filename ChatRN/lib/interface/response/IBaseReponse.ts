export default interface IBaseResponse {
  status: number;
  message: TValidationMessage | 'ok';
  data: [] | object | number;
}

type TValidationMessage = {
  [key: string]: string[];
};

import IBaseResponse from './IBaseReponse';

export default interface ISearchResponse extends IBaseResponse {
  data: TSearchData[] | [];
}

export type TSearchData = {
  id: number;
  name: string;
  username: string;
  profile_image_url: string | null;
};

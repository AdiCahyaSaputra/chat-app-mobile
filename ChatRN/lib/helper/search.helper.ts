import IUser from '../interface/entities/IUser';
import { TContactsData } from '../interface/response/IContactsResponse';

export const getStatus = (
  username: string,
  friends: [] | TContactsData[],
  currentUser: IUser | null,
) => {
  let status: 'idle' | 'loading' | 'error' | 'success' = 'idle';

  const alreadyFriend = friends.find(
    friend => friend.contact_username === username,
  );
  const sameWithCurrentUser = username === currentUser?.username;

  if (sameWithCurrentUser) {
    status = 'error';
  }

  if (alreadyFriend) {
    status = 'success';
  }

  return status;
};

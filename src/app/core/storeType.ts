import { Store } from 'redux';
import { UserPersonnal } from './interfaces/user-infos.interface';

export interface RootState {
  users: UserPersonnal[];
}

export type StoreState = ReturnType<Store['getState']>;
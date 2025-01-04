import { Store } from 'redux';
import { User } from './interfaces/user.interface';

export interface RootState {
  users: User[];
}

export type StoreState = ReturnType<Store['getState']>;
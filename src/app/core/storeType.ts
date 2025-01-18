import { Store } from 'redux';
import { UserState } from './interfaces/user-state-interface';

export interface RootState {
  users: UserState;
}

export type StoreState = ReturnType<Store['getState']>;
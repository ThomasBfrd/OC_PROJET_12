import { StoreState } from "./types/store-types";


export const selectUsers = (state: StoreState) => state.users;
export const selectDataSource = (state: StoreState) => state.users.dataSource;
export const selectStatus = (state: StoreState) => state.users.status;

import { RootState } from "./store";

export const selectUsers = (state: RootState) => state.users;
export const selectDataSource = (state: RootState) => state.users.dataSource;
export const selectStatus = (state: RootState) => state.users.status;

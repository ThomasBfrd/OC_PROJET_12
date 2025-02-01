import { Store } from "@reduxjs/toolkit";
import { store } from "../store";

export type StoreState = ReturnType<Store['getState']>;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
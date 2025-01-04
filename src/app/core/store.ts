import { configureStore } from "@reduxjs/toolkit";
import { User } from "./interfaces/user.interface";


const state = {
    users: [],
    user: null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (currentState: any, action: any) => {
    switch (action.type) {
        case 'GET_LOCAL_USER': {
            const userList: Array<User> = [...currentState.users, ...action.payload]
            console.log(userList);
            
                return {...currentState, users: userList}
        }
        case 'GET_API_USER': {
            const userList: Array<User> = [
                ...(currentState.user || []), 
                ...(Array.isArray(action.payload) ? action.payload : [])
            ];
            console.log(userList);
            
            return {...currentState, user: userList}
        }
    
        default:
            return currentState;
    }
}

export const store = configureStore({
    preloadedState: state,
    reducer
})
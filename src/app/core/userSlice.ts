import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAverageSessions, getPerformances, getUserActivity, getUserInfos } from '../../Api/Api';
import { UserInfos } from './interfaces/user-infos.interface';
import { UserActivity } from './interfaces/user-activity';
import { UserPerformances } from './interfaces/user-performance';
import { UserAverageSession } from './interfaces/user-average';

export interface UserState {
    localUser:
        {
            data: UserInfos | null,
            activity: UserActivity | null,
            performances: UserPerformances | null,
            averageSession: UserAverageSession | null
        };
    apiUser:
        {
            data: UserInfos | null,
            activity: UserActivity | null,
            performances: UserPerformances | null,
            averageSession: UserAverageSession | null
        };
    dataSource: 'local' | 'api';
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
};
const initialState: UserState = {
    localUser: {
        data: null,
        activity: null,
        performances: null,
        averageSession: null
    },
    apiUser: {
        data: null,
        activity: null,
        performances: null,
        averageSession: null
    },
    dataSource: 'local',
    status: 'idle'
};

// Requête locale - User Infos
export const fetchLocalUserInfos = createAsyncThunk(
    'user/fetchLocalUserInfos',
    async () => {
        const response = await getUserInfos('local');
        // console.log(response[0]);
        
        return response[0];
    }
);

// Requête locale - User Activity
export const fetchLocalUserActivity = createAsyncThunk(
    'user/fetchLocalUserActivity',
    async () => {
        const response = await getUserActivity('local');
        // console.log(response[0]);
        
        return response[0];
    }
);

// Requête locale - User Average Sessions
export const fetchLocalUserAverageSessions = createAsyncThunk(
    'user/fetchLocalUserAverageSessions',
    async () => {
        const response = await getAverageSessions('local');
        // console.log(response[0]);
        
        return response[0];
    }
);

// Requête locale - User Perfomances
export const fetchLocalUserPerformances = createAsyncThunk(
    'user/fetchLocalUserPerformances',
    async () => {
        const response = await getPerformances('local');
        // console.log(response[0]);
        
        return response[0];
    }
);

// Requête API
export const fetchApiUserInfos = createAsyncThunk(
    'user/fetchApiUserInfos',
    async () => {
        const response = await getUserInfos('api');
        // console.log(response.data);
        
        return response.data;
    }
);

// Requête API - User Activity
export const fetchApiUserActivity = createAsyncThunk(
    'user/fetchApiUserActivity',
    async () => {
        const response = await getUserActivity('api');
        // console.log(response.data);
        
        return response.data;
    }
);

// Requête API - User Average Sessions
export const fetchApiUserAverageSessions = createAsyncThunk(
    'user/fetchApiUserAverageSessions',
    async () => {
        const response = await getAverageSessions('api');
        // console.log(response.data);
        
        return response.data;
    }
);

// Requête API - User Perfomances
export const fetchApiUserPerformances = createAsyncThunk(
    'user/fetchApiUserPerformances',
    async () => {
        const response = await getPerformances('api');
        // console.log(response.data);
        
        return response.data;
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        switchDataSource: (state) => {
            state.dataSource = state.dataSource === 'local' ? 'api' : 'local';
        }
    },
    extraReducers: (builder) => {
        builder
        // Local - User Infos
        .addCase(fetchLocalUserInfos.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchLocalUserInfos.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.localUser.data = action.payload;
        })
        .addCase(fetchLocalUserInfos.rejected, (state) => {
            state.status = 'failed';
        })

        // Local - Activity
        .addCase(fetchLocalUserActivity.pending, (state) => {
            state.status = 'loading';
        }) 
        .addCase(fetchLocalUserActivity.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.localUser.activity = action.payload;
        })
        .addCase(fetchLocalUserActivity.rejected, (state) => {
            state.status = 'failed';
        })

        // Local - Average Sessions
        .addCase(fetchLocalUserAverageSessions.pending, (state) => {
            state.status = 'loading';
        }) 
        .addCase(fetchLocalUserAverageSessions.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.localUser.averageSession = action.payload;
        })
        .addCase(fetchLocalUserAverageSessions.rejected, (state) => {
            state.status = 'failed';
        })

        // Local - Average Performances
        .addCase(fetchLocalUserPerformances.pending, (state) => {
            state.status = 'loading';
        }) 
        .addCase(fetchLocalUserPerformances.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.localUser.performances = action.payload;
        })
        .addCase(fetchLocalUserPerformances.rejected, (state) => {
            state.status = 'failed';
        })


        // API - User Infos
        .addCase(fetchApiUserInfos.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchApiUserInfos.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.apiUser.data = action.payload;
        })
        .addCase(fetchApiUserInfos.rejected, (state) => {
            state.status = 'failed';
        })

         // API - User Activity
        .addCase(fetchApiUserActivity.pending, (state) => {
            state.status = 'loading';
        }) 
        .addCase(fetchApiUserActivity.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.apiUser.activity = action.payload;
        })
        .addCase(fetchApiUserActivity.rejected, (state) => {
            state.status = 'failed';
        })

        // API - User Average Sessions
        .addCase(fetchApiUserAverageSessions.pending, (state) => {
            state.status = 'loading';
        }) 
        .addCase(fetchApiUserAverageSessions.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.apiUser.averageSession = action.payload;
        })
        .addCase(fetchApiUserAverageSessions.rejected, (state) => {
            state.status = 'failed';
        })

        // API - User Average Performances
        .addCase(fetchApiUserPerformances.pending, (state) => {
            state.status = 'loading';
        }) 
        .addCase(fetchApiUserPerformances.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.apiUser.performances = action.payload;
        })
        .addCase(fetchApiUserPerformances.rejected, (state) => {
            state.status = 'failed';
        })
    }
});

export const { switchDataSource } = userSlice.actions;

export default userSlice.reducer;
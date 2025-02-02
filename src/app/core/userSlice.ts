import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUserData } from "../../Api/Api";
import { UserState } from "./interfaces/user-state-interface";

const initialState: UserState = {
  localAllData: {
    data: null,
    activity: null,
    performances: null,
    averageSession: null,
  },
  apiAllData: {
    data: null,
    activity: null,
    performances: null,
    averageSession: null,
  },
  dataSource: "local",
  status: "idle",
  userId: '12'
};

// Requête LOCALE - ALL DATA
export const fetchLocalUserAllData = createAsyncThunk(
  "user/fetchLocalUserAllData",
  async () => {
    const response = await getAllUserData("local");
    
    if (response) {
      return {
        data: response[0],
        activity: response[1],
        performances: response[2],
        averageSession: response[3],
      };
    }
  }
);

// Requête API - ALL DATA
export const fetchApiUserAllData = createAsyncThunk(
  "user/fetchApiUserAllData",
  async (userId: string) => {
    const response = await getAllUserData("api", userId);
    if (response) {
      return {
        data: response[0],
        activity: response[1],
        performances: response[2],
        averageSession: response[3],
      };
    } else {
      throw new Error("Erreur dans la récupération de données");
      
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    switchDataSource: (state) => {
      state.dataSource = state.dataSource === "local" ? "api" : "local";
    },
  },
  extraReducers: (builder) => {
    builder
      // LOCAL - ALL DATA
      .addCase(fetchLocalUserAllData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLocalUserAllData.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.localAllData = action.payload;
        }
      })
      .addCase(fetchLocalUserAllData.rejected, (state) => {
        state.status = "failed";
      })

      // API - ALL DATA
      .addCase(fetchApiUserAllData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchApiUserAllData.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.apiAllData = {
            data: action.payload.data.data,
            activity: action.payload.activity.data,
            performances: action.payload.performances.data,
            averageSession: action.payload.averageSession.data,
          };
        }
      })
      .addCase(fetchApiUserAllData.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { switchDataSource } = userSlice.actions;

export default userSlice.reducer;

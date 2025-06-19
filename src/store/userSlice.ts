import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { User } from "../types/User.ts";


interface Filters {
  name: string;
  username: string;
  email: string;
  phone: string;
}

interface UserState {
  users: User[];
  filters: Filters;
  status:"loading" | "succeeded" | "error"
  error:string|null
}

const initialState: UserState = {
  users: [],
  filters: {
    name: "",
    username: "",
    email: "",
    phone: "",
  },
  status:'loading',
  error:null
};

const API_URL = import.meta.env.VITE_API_URL;

export const fetchUsers = createAsyncThunk("users/fetch", async () => {
  const res = await axios.get<User[]>(
    `${API_URL}/users`
  );
  return res.data;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ field: string; value: string }>) {
      const { field, value } = action.payload;
      state.filters[field as keyof Filters] = value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.status='loading'
      state.error = null
    }).addCase(fetchUsers.fulfilled,(state,action)=>{
      state.status = 'succeeded'
      state.users = action.payload;
      state.error = null
    }).addCase(fetchUsers.rejected,(state,action)=>{
      state.error = 'error'
      state.error = action.error.message||'Failed fetch'
    })
  },
});

export const { setFilter } = userSlice.actions;
export default userSlice.reducer;

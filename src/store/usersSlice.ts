import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User, LoadingState } from "../types";
import { userApi } from "../services/api";
import _merge from "lodash/merge";
import { errors } from "../constants/MicroCopy";

interface UsersState extends LoadingState {
  users: User[];
  selectedUser: User | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => await userApi.getUsers()
);

export const fetchUser = createAsyncThunk(
  "users/fetchUser",
  async (id: number) => await userApi.getUser(id)
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }: { id: number; user: Partial<User> }) =>
    await userApi.updateUser(id, user)
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || errors.failedToFetchUsers;
      })
      // Fetch user
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || errors.failedToFetchUsers;
      })
      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        _merge(
          state.users.find((user) => user.id === updatedUser.id),
          updatedUser
        );
        if (state.selectedUser?.id === updatedUser.id)
          state.selectedUser = { ...state.selectedUser, ...updatedUser };
      });
  },
});

export const { clearError, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;

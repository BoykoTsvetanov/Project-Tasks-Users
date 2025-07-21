import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Post, LoadingState } from "../types";
import { postApi } from "../services/api";
import _merge from "lodash/merge";

type PostsState = LoadingState & {
  posts: Post[];
};

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId: number) => {
    return await postApi.getUserPosts(userId);
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, post }: { id: number; post: Partial<Post> }) => {
    return await postApi.updatePost(id, post);
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id: number) => {
    await postApi.deletePost(id);
    return id;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      // Update post
      .addCase(updatePost.fulfilled, (state, action) => {
        const updatedPost = action.payload;
        _merge(
          state.posts.find((post) => post.id === updatedPost.id),
          updatedPost
        );
      })
      // Delete post
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      });
  },
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;

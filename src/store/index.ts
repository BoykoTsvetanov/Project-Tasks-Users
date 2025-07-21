import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import postsReducer from './postsSlice';
import todosReducer from './todosSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    todos: todosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer, { fetchUsers } from '../store/usersSlice';
import postsReducer, { fetchUserPosts } from '../store/postsSlice';
import todosReducer, { fetchTodos, setFilters } from '../store/todosSlice';

describe('Redux Store', () => {
  describe('usersSlice', () => {
    it('should handle initial state', () => {
      expect(usersReducer(undefined, { type: 'unknown' })).toEqual({
        users: [],
        selectedUser: null,
        loading: false,
        error: null,
      });
    });

    it('should handle fetchUsers.pending', () => {
      const action = { type: fetchUsers.pending.type };
      const state = usersReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('postsSlice', () => {
    it('should handle initial state', () => {
      expect(postsReducer(undefined, { type: 'unknown' })).toEqual({
        posts: [],
        loading: false,
        error: null,
      });
    });

    it('should handle fetchUserPosts.pending', () => {
      const action = { type: fetchUserPosts.pending.type };
      const state = postsReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('todosSlice', () => {
    it('should handle initial state', () => {
      const initialState = todosReducer(undefined, { type: 'unknown' });
      expect(initialState.todos).toEqual([]);
      expect(initialState.filteredTodos).toEqual([]);
      expect(initialState.filters.status).toBe('all');
      expect(initialState.pagination.currentPage).toBe(1);
      expect(initialState.pagination.pageSize).toBe(10);
    });

    it('should handle setFilters', () => {
      const action = setFilters({ status: 'completed', title: 'test' });
      const state = todosReducer(undefined, action);
      expect(state.filters.status).toBe('completed');
      expect(state.filters.title).toBe('test');
      expect(state.pagination.currentPage).toBe(1);
    });

    it('should handle fetchTodos.pending', () => {
      const action = { type: fetchTodos.pending.type };
      const state = todosReducer(undefined, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('store configuration', () => {
    it('should create store with all reducers', () => {
      const store = configureStore({
        reducer: {
          users: usersReducer,
          posts: postsReducer,
          todos: todosReducer,
        },
      });

      const state = store.getState();
      expect(state.users).toBeDefined();
      expect(state.posts).toBeDefined();
      expect(state.todos).toBeDefined();
    });
  });
});

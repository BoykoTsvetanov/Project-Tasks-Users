import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _merge from "lodash/merge";
import { type Todo, type LoadingState, Statuses } from "../types";
import { todoApi } from "../services/api";
import { errors } from "../constants/MicroCopy";

type TodosFilters = {
  status: Statuses;
  title: string;
  userId: number | null;
};

type TodosState = LoadingState & {
  todos: Todo[];
  filteredTodos: Todo[];
  filters: TodosFilters;
  pagination: {
    currentPage: number;
    pageSize: number;
    total: number;
  };
};

const initialState: TodosState = {
  todos: [],
  filteredTodos: [],
  loading: false,
  error: null,
  filters: {
    status: Statuses.ALL,
    title: "",
    userId: null,
  },
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
  },
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  return await todoApi.getTodos();
});

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, todo }: { id: number; todo: Partial<Todo> }) => {
    return await todoApi.updateTodo(id, todo);
  }
);

const applyFilters = (todos: Todo[], filters: TodosFilters) =>
  todos.filter((todo) => {
    const statusMatch =
      filters.status === Statuses.ALL ||
      (filters.status === Statuses.COMPLETED && todo.completed) ||
      (filters.status === Statuses.PENDING && !todo.completed);

    const titleMatch =
      !filters.title ||
      todo.title.toLowerCase().includes(filters.title.toLowerCase());

    const userMatch = !filters.userId || todo.userId === filters.userId;

    return statusMatch && titleMatch && userMatch;
  });

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredTodos = applyFilters(state.todos, state.filters);
      state.pagination.total = state.filteredTodos.length;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
        state.filteredTodos = applyFilters(action.payload, state.filters);
        state.pagination.total = state.filteredTodos.length;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || errors.failedToFetchTodos;
      })
      // Update todo
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updatedTodo = action.payload;

        _merge(
          state.todos.find((t) => t.id === updatedTodo.id),
          updatedTodo
        );

        state.filteredTodos = applyFilters(state.todos, state.filters);
        state.pagination.total = state.filteredTodos.length;
      });
  },
});

export const { clearError, setFilters, setPage } = todosSlice.actions;
export default todosSlice.reducer;

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import UsersList from "../components/Users/UsersList";
import usersReducer from "../store/usersSlice";
import type { User } from "../types";
import { errors } from "../constants/MicroCopy";

vi.mock("../store/usersSlice", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    fetchUsers: () => () => {}, // no-op thunk
  };
});

// Mock the API
vi.mock("../services/api", () => ({
  userApi: {
    getUsers: vi.fn(),
    updateUser: vi.fn(),
  },
}));

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    address: {
      street: "Main St",
      suite: "Apt 1",
      city: "New York",
      zipcode: "10001",
      geo: { lat: "40.7128", lng: "-74.0060" },
    },
    phone: "123-456-7890",
    website: "john.com",
    company: {
      name: "Test Company",
      catchPhrase: "Test phrase",
      bs: "test bs",
    },
  },
];

const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      users: usersReducer,
    },
    preloadedState: {
      users: {
        users: mockUsers,
        selectedUser: null,
        loading: false,
        error: null,
        ...initialState,
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  store = createTestStore()
) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("UsersList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders users list", () => {
    renderWithProviders(<UsersList />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("John Doe (@johndoe)")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    const store = createTestStore({ loading: true });
    renderWithProviders(<UsersList />, store);

    expect(
      screen.getByTestId("loading-spinner") ||
        screen.getAllByRole("img", { name: /loading/i })[0]
    ).toBeInTheDocument();
  });

  it("shows error state", () => {
    const store = createTestStore({ error: errors.failedToFetchUsers });
    renderWithProviders(<UsersList />, store);

    expect(screen.getByText(errors.failedToFetchUsers)).toBeInTheDocument();
  });

  it("shows See posts button", () => {
    renderWithProviders(<UsersList />);

    expect(
      screen.getAllByRole("button", { name: /see posts/i, hidden: true })
    ).toHaveLength(2);
  });
});

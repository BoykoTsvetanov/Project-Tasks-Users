export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export type LoadingState = {
  loading: boolean;
  error: string | null;
};

export type UserFormData = {
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
  };
};

export enum Statuses {
  ALL = "all",
  COMPLETED = "completed",
  PENDING = "pending",
}

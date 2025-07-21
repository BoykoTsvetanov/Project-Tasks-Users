import axios from 'axios';
import type { User, Post, Todo } from '../types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const userApi = {
  getUsers: (): Promise<User[]> => 
    api.get('/users').then(response => response.data),
  
  getUser: (id: number): Promise<User> => 
    api.get(`/users/${id}`).then(response => response.data),
  
  updateUser: (id: number, user: Partial<User>): Promise<User> => 
    api.put(`/users/${id}`, user).then(response => response.data),
};

export const postApi = {
  getUserPosts: (userId: number): Promise<Post[]> => 
    api.get(`/posts?userId=${userId}`).then(response => response.data),
  
  updatePost: (id: number, post: Partial<Post>): Promise<Post> => 
    api.put(`/posts/${id}`, post).then(response => response.data),
  
  deletePost: (id: number): Promise<void> => 
    api.delete(`/posts/${id}`).then(() => undefined),
};

export const todoApi = {
  getTodos: (): Promise<Todo[]> => 
    api.get('/todos').then(response => response.data),
  
  updateTodo: (id: number, todo: Partial<Todo>): Promise<Todo> => 
    api.put(`/todos/${id}`, todo).then(response => response.data),
};

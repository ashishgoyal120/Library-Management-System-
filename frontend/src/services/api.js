import axios from "axios";

export const api = axios.create({
  //baseURL: 'http://localhost:8080',
  baseURL: "https://library-management-system-34c0.onrender.com",
  headers: { "Content-Type": "application/json" },
});

export function getErrorMessage(err) {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Something went wrong";
  return String(msg);
}

// Books
export const BooksApi = {
  list: (page, size) => api.get(`/api/books`, { params: { page, size } }),
  available: (page, size) =>
    api.get(`/api/books/available`, { params: { page, size } }),
  search: (keyword, page, size) =>
    api.get(`/api/books/search`, { params: { keyword, page, size } }),
  get: (id) => api.get(`/api/books/${id}`),
  create: (payload) => api.post(`/api/books`, payload),
  update: (id, payload) => api.put(`/api/books/${id}`, payload),
  remove: (id) => api.delete(`/api/books/${id}`),
};

// Authors
export const AuthorsApi = {
  list: () => api.get(`/api/authors`),
  get: (id) => api.get(`/api/authors/${id}`),
  create: (payload) => api.post(`/api/authors`, payload),
  update: (id, payload) => api.put(`/api/authors/${id}`, payload),
  remove: (id) => api.delete(`/api/authors/${id}`),
};

// Categories
export const CategoriesApi = {
  list: () => api.get(`/api/categories`),
  get: (id) => api.get(`/api/categories/${id}`),
  create: (payload) => api.post(`/api/categories`, payload),
  update: (id, payload) => api.put(`/api/categories/${id}`, payload),
  remove: (id) => api.delete(`/api/categories/${id}`),
};

// Users/Members
export const UsersApi = {
  list: () => api.get(`/api/users`),
  get: (id) => api.get(`/api/users/${id}`),
  create: (payload) => api.post(`/api/users`, payload),
  update: (id, payload) => api.put(`/api/users/${id}`, payload),
  remove: (id) => api.delete(`/api/users/${id}`),
};

// Borrow
export const BorrowApi = {
  issue: (payload) => api.post(`/api/borrow/issue`, payload),
  returnBook: (borrowRecordId) =>
    api.put(`/api/borrow/return/${borrowRecordId}`),
  active: () => api.get(`/api/borrow/active`),
  overdue: () => api.get(`/api/borrow/overdue`),
  userHistory: (userId) => api.get(`/api/borrow/user/${userId}`),
  bookHistory: (bookId) => api.get(`/api/borrow/book/${bookId}`),
};

// Dashboard
export const DashboardApi = {
  stats: () => api.get(`/api/dashboard/stats`),
};

// Auth
export const AuthApi = {
  login: (payload) => api.post(`/api/auth/login`, payload),
  register: (payload) => api.post(`/api/auth/register`, payload),
};

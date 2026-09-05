
import { api } from './api';
export const booksService = {
  getAll: () => api.get('/books'),
  getById: (id: string) => api.get(`/books/${id}`),
  search: (query: string) => api.get(`/books/search?q=${query}`),
};

// import api from './api'

// export const bookService = {
//   // Get all books with search and filters
//   getBooks: (params = {}) => {
//     return api.get('/books', { params })
//   },

//   // Get single book
//   getBook: (id) => {
//     return api.get(`/books/${id}`)
//   },

//   // Create book (Admin only)
//   createBook: (bookData) => {
//     return api.post('/books', bookData)
//   },

//   // Update book (Admin only)
//   updateBook: (id, bookData) => {
//     return api.put(`/books/${id}`, bookData)
//   },

//   // Delete book (Admin only)
//   deleteBook: (id) => {
//     return api.delete(`/books/${id}`)
//   },

//   // Get book statistics (Admin only)
//   getBookStats: () => {
//     return api.get('/books/stats/overview')
//   }
// }


import api from './api'

const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const bookService = {
  // Get all books with search and filters
  getBooks: (params = {}) => {
    return api.get('/books', { params, headers: getAuthHeader() })
  },

  // Get single book
  getBook: (id) => {
    return api.get(`/books/${id}`, { headers: getAuthHeader() })
  },

  // Create book (Admin only)
  createBook: (bookData) => {
    return api.post('/books', bookData, { headers: getAuthHeader() })
  },

  // Update book (Admin only)
  updateBook: (id, bookData) => {
    return api.put(`/books/${id}`, bookData, { headers: getAuthHeader() })
  },

  // Delete book (Admin only)
  deleteBook: (id) => {
    return api.delete(`/books/${id}`, { headers: getAuthHeader() })
  },

  // Get book statistics (Admin only)
  getBookStats: () => {
    return api.get('/books/stats/overview', { headers: getAuthHeader() })
  }
}

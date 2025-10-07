import api from './api'

export const borrowService = {
  // Borrow book individually
  borrowIndividual: (bookId) => {
    return api.post('/borrow/individual', { bookId })
  },

  // Borrow book for group
  borrowGroup: (bookId, groupId) => {
    return api.post('/borrow/group', { bookId, groupId })
  },

  // Return book
  returnBook: (borrowId, condition, notes = '') => {
    return api.put(`/borrow/return/${borrowId}`, { condition, notes })
  },

  // Get borrow history
  getBorrowHistory: (params = {}) => {
    return api.get('/borrow/history', { params })
  },

  // Get current borrowings
  getCurrentBorrows: () => {
    return api.get('/borrow/current')
  },

  // Pay fine
  payFine: (borrowId) => {
    return api.put(`/borrow/pay-fine/${borrowId}`)
  }
}

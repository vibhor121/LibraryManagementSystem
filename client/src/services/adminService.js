import api from './api'

export const adminService = {
  // Get dashboard statistics
  getDashboardStats: () => {
    return api.get('/admin/dashboard')
  },

  // Get all users
  getUsers: (params = {}) => {
    return api.get('/admin/users', { params })
  },

  // Get all borrow records
  getBorrowRecords: (params = {}) => {
    return api.get('/admin/borrow-records', { params })
  },

  // Get all groups
  getGroups: (params = {}) => {
    return api.get('/admin/groups', { params })
  },

  // Get all feedback
  getFeedback: (params = {}) => {
    return api.get('/admin/feedback', { params })
  },

  // Update feedback status
  updateFeedbackStatus: (id, status, adminResponse = '') => {
    return api.put(`/admin/feedback/${id}/status`, { status, adminResponse })
  },

  // Update user status
  updateUserStatus: (id, isActive) => {
    return api.put(`/admin/users/${id}/status`, { isActive })
  },

  // Create admin user
  createAdmin: (userData) => {
    return api.post('/admin/create-admin', userData)
  }
}

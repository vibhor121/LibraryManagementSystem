import api from './api'

export const authService = {
  // Login user
  login: (email, password) => {
    return api.post('/auth/login', { email, password })
  },

  // Register user
  register: (userData) => {
    return api.post('/auth/register', userData)
  },

  // Get current user
  getCurrentUser: () => {
    return api.get('/auth/me')
  },

  // Update user profile
  updateProfile: (userData) => {
    return api.put('/auth/profile', userData)
  },

  // Change password
  changePassword: (currentPassword, newPassword) => {
    return api.put('/auth/change-password', {
      currentPassword,
      newPassword
    })
  }
}

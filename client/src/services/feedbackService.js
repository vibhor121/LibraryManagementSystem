import api from './api'

export const feedbackService = {
  // Submit feedback
  submitFeedback: (feedbackData) => {
    return api.post('/feedback', feedbackData)
  },

  // Get all public feedback
  getFeedback: (params = {}) => {
    return api.get('/feedback', { params })
  },

  // Get user's feedback
  getMyFeedback: (params = {}) => {
    return api.get('/feedback/my-feedback', { params })
  },

  // Get single feedback
  getFeedbackById: (id) => {
    return api.get(`/feedback/${id}`)
  },

  // Update feedback
  updateFeedback: (id, feedbackData) => {
    return api.put(`/feedback/${id}`, feedbackData)
  },

  // Delete feedback
  deleteFeedback: (id) => {
    return api.delete(`/feedback/${id}`)
  },

  // Get feedback statistics (Admin only)
  getFeedbackStats: () => {
    return api.get('/feedback/stats/overview')
  }
}

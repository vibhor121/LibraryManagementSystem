import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { ChatBubbleLeftRightIcon, StarIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await adminService.getFeedback({ limit: 50 })
      setFeedback(response.data.data.feedback)
    } catch (error) {
      toast.error('Failed to load feedback')
      console.error('Feedback error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateFeedbackStatus = async (feedbackId, status, adminResponse = '') => {
    try {
      await adminService.updateFeedbackStatus(feedbackId, status, adminResponse)
      toast.success('Feedback status updated successfully')
      fetchFeedback()
    } catch (error) {
      toast.error('Failed to update feedback status')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'dismissed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Feedback</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and respond to user feedback
          </p>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {feedback.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No feedback has been submitted yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {feedback.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {item.message}
                      </p>
                      {item.book && (
                        <p className="text-sm text-blue-600 mb-2">
                          About: {item.book.title}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 ml-4">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < item.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {item.user.name}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span className="capitalize">{item.category}</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  {item.adminResponse && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Admin Response</h4>
                      <p className="text-sm text-gray-600">{item.adminResponse}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {item.adminResponseDate ? new Date(item.adminResponseDate).toLocaleDateString() : ''}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateFeedbackStatus(item._id, 'reviewed')}
                      className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded hover:bg-blue-200"
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      onClick={() => updateFeedbackStatus(item._id, 'resolved')}
                      className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded hover:bg-green-200"
                    >
                      Mark as Resolved
                    </button>
                    <button
                      onClick={() => updateFeedbackStatus(item._id, 'dismissed')}
                      className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded hover:bg-red-200"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminFeedback

import { useState, useEffect } from 'react'
import { feedbackService } from '../services/feedbackService'
import LoadingSpinner from '../components/LoadingSpinner'
import { StarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Feedback = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await feedbackService.getFeedback()
      setFeedback(response.data.data.feedback || [])
    } catch (error) {
      toast.error('Failed to load feedback')
      console.error('Feedback error:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
          <p className="mt-1 text-sm text-gray-500">
            Share your thoughts about books and library services
          </p>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {feedback.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Be the first to share your thoughts about our library.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.message}
                      </p>
                      {item.book && (
                        <p className="text-sm text-blue-600 mt-1">
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
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>by {item.user.name}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
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

export default Feedback

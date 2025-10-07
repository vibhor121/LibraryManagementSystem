import { useState, useEffect } from 'react'
import { borrowService } from '../services/borrowService'
import LoadingSpinner from '../components/LoadingSpinner'
import { ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const MyBooks = () => {
  const [currentBorrows, setCurrentBorrows] = useState([])
  const [borrowHistory, setBorrowHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('current')

  useEffect(() => {
    fetchBorrowData()
  }, [])

  const fetchBorrowData = async () => {
    try {
      setLoading(true)
      
      // Fetch current borrowings
      const currentResponse = await borrowService.getCurrentBorrows()
      setCurrentBorrows(currentResponse.data.data.borrowRecords || [])
      
      // Fetch borrow history
      const historyResponse = await borrowService.getBorrowHistory()
      setBorrowHistory(historyResponse.data.data.borrowRecords || [])
    } catch (error) {
      toast.error('Failed to load borrow data')
      console.error('Borrow data error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status, dueDate) => {
    const isOverdue = new Date(dueDate) < new Date()
    
    switch (status) {
      case 'borrowed':
        return isOverdue ? (
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        ) : (
          <ClockIcon className="h-5 w-5 text-yellow-500" />
        )
      case 'returned':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status, dueDate) => {
    const isOverdue = new Date(dueDate) < new Date()
    
    switch (status) {
      case 'borrowed':
        return isOverdue ? 'Overdue' : 'Borrowed'
      case 'returned':
        return 'Returned'
      default:
        return status
    }
  }

  const getStatusColor = (status, dueDate) => {
    const isOverdue = new Date(dueDate) < new Date()
    
    switch (status) {
      case 'borrowed':
        return isOverdue ? 'text-red-600' : 'text-yellow-600'
      case 'returned':
        return 'text-green-600'
      default:
        return 'text-gray-600'
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
          <h1 className="text-2xl font-bold text-gray-900">My Books</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your current borrowings and view your borrowing history
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('current')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'current'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Current Borrowings ({currentBorrows.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Borrow History ({borrowHistory.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'current' ? (
            <div className="space-y-4">
              {currentBorrows.length === 0 ? (
                <div className="text-center py-12">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No current borrowings</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You don't have any books borrowed at the moment.
                  </p>
                </div>
              ) : (
                currentBorrows.map((borrow) => (
                  <div key={borrow._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(borrow.status, borrow.dueDate)}
                          <h3 className="text-lg font-medium text-gray-900">
                            {borrow.book.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          by {borrow.book.author}
                        </p>
                        {borrow.group && (
                          <p className="text-sm text-blue-600 mt-1">
                            Borrowed as group: {borrow.group.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getStatusColor(borrow.status, borrow.dueDate)}`}>
                          {getStatusText(borrow.status, borrow.dueDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(borrow.dueDate).toLocaleDateString()}
                        </p>
                        {borrow.fine > 0 && (
                          <p className="text-xs text-red-600">
                            Fine: ₹{borrow.fine}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {borrowHistory.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No borrow history</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    You haven't borrowed any books yet.
                  </p>
                </div>
              ) : (
                borrowHistory.map((borrow) => (
                  <div key={borrow._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(borrow.status, borrow.dueDate)}
                          <h3 className="text-lg font-medium text-gray-900">
                            {borrow.book.title}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          by {borrow.book.author}
                        </p>
                        {borrow.group && (
                          <p className="text-sm text-blue-600 mt-1">
                            Borrowed as group: {borrow.group.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${getStatusColor(borrow.status, borrow.dueDate)}`}>
                          {getStatusText(borrow.status, borrow.dueDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}
                        </p>
                        {borrow.returnDate && (
                          <p className="text-xs text-gray-500">
                            Returned: {new Date(borrow.returnDate).toLocaleDateString()}
                          </p>
                        )}
                        {borrow.fine > 0 && (
                          <p className={`text-xs ${borrow.isFinePaid ? 'text-green-600' : 'text-red-600'}`}>
                            Fine: ₹{borrow.fine} {borrow.isFinePaid ? '(Paid)' : '(Unpaid)'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyBooks

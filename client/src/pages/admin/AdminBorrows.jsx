import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { BookOpenIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const AdminBorrows = () => {
  const [borrowRecords, setBorrowRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBorrowRecords()
  }, [])

  const fetchBorrowRecords = async () => {
    try {
      setLoading(true)
      const response = await adminService.getBorrowRecords({ limit: 50 })
      setBorrowRecords(response.data.data.borrowRecords)
    } catch (error) {
      toast.error('Failed to load borrow records')
      console.error('Borrow records error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'borrowed':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'returned':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'overdue':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
      default:
        return <BookOpenIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'borrowed':
        return 'text-yellow-600'
      case 'returned':
        return 'text-green-600'
      case 'overdue':
        return 'text-red-600'
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
          <h1 className="text-2xl font-bold text-gray-900">Borrow Records</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all borrowing records
          </p>
        </div>
      </div>

      {/* Borrow Records Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {borrowRecords.length === 0 ? (
            <div className="text-center py-12">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No borrow records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No books have been borrowed yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrower
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Group
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Borrow Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fine
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {borrowRecords.map((record) => (
                    <tr key={record._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.book.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            by {record.book.author}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.borrower.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.borrower.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.group ? record.group.name : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.borrowDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <span className={`ml-2 text-sm font-medium ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{record.fine || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminBorrows

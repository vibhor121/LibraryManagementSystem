import { useState, useEffect } from 'react'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { 
  BookOpenIcon, 
  UserIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await adminService.getDashboardStats()
      setStats(response.data.data)
    } catch (error) {
      console.error('Dashboard stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Failed to load dashboard</h2>
        <p className="mt-2 text-gray-600">Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of library management system
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Users */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.users.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Books */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Books
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.books.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Active Borrows */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Borrows
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.borrowing.active}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Books */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue Books
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.borrowing.overdue}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Books Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Books Overview
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Copies</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats.books.totalCopies}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Available Copies</dt>
                <dd className="mt-1 text-2xl font-semibold text-green-600">
                  {stats.books.availableCopies}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Borrowed Copies</dt>
                <dd className="mt-1 text-2xl font-semibold text-blue-600">
                  {stats.books.borrowedCopies}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Fines</dt>
                <dd className="mt-1 text-2xl font-semibold text-red-600">
                  ₹{stats.borrowing.totalFines}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Users Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Users Overview
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Users</dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {stats.users.total}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Admins</dt>
                <dd className="mt-1 text-2xl font-semibold text-purple-600">
                  {stats.users.admins}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Users with Fines</dt>
                <dd className="mt-1 text-2xl font-semibold text-orange-600">
                  {stats.users.withFines}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Groups</dt>
                <dd className="mt-1 text-2xl font-semibold text-blue-600">
                  {stats.groups.total}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Borrows */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Borrowings
            </h3>
            {stats.recentActivity.borrows.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent borrowings</p>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.borrows.slice(0, 5).map((borrow) => (
                  <div key={borrow._id} className="flex items-center space-x-3">
                    <BookOpenIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {borrow.book.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {borrow.borrower.name}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(borrow.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Feedback
            </h3>
            {stats.recentActivity.feedback.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent feedback</p>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.feedback.slice(0, 5).map((feedback) => (
                  <div key={feedback._id} className="flex items-center space-x-3">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {feedback.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        by {feedback.user.name}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

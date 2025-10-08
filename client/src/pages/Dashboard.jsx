import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { borrowService } from '../services/borrowService'
import { groupService } from '../services/groupService'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  BookOpenIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  UserGroupIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user } = useAuth()
  const [currentBorrows, setCurrentBorrows] = useState([])
  const [userGroup, setUserGroup] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch current borrowings
        const borrowsResponse = await borrowService.getCurrentBorrows()
        setCurrentBorrows(borrowsResponse.data.data.borrowRecords || [])
        
        // Fetch user's group
        try {
          const groupResponse = await groupService.getMyGroup()
          setUserGroup(groupResponse.data.data.group)
        } catch (error) {
          // User might not be in a group, that's okay
          setUserGroup(null)
        }
      } catch (error) {
        toast.error('Failed to load dashboard data')
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date()
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      {/* <div className="bg-white overflow-hidden shadow rounded-lg"> */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your library account.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Current Borrows
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {currentBorrows.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overdue Books
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {currentBorrows.filter(borrow => isOverdue(borrow.dueDate)).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Fines
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ₹{user.totalFines || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Group Status
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userGroup ? 'In Group' : 'No Group'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Borrowings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Current Borrowings
          </h3>
          {currentBorrows.length === 0 ? (
            <div className="text-center py-6">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No current borrowings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Start by browsing our book collection.
              </p>
              <div className="mt-6">
                <Link
                  to="/books"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {currentBorrows.map((borrow) => {
                const daysUntilDue = getDaysUntilDue(borrow.dueDate)
                const overdue = isOverdue(borrow.dueDate)
                
                return (
                  <div key={borrow._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900">
                          {borrow.book.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          by {borrow.book.author}
                        </p>
                        {borrow.group && (
                          <p className="text-sm text-blue-600">
                            Borrowed as group: {borrow.group.name}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          overdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {overdue ? 'Overdue' : `${daysUntilDue} days left`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {new Date(borrow.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {overdue && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-600">
                          This book is overdue. Please return it as soon as possible to avoid additional fines.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Group Information */}
      {userGroup && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Your Group
            </h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                {userGroup.name}
              </h4>
              <p className="text-sm text-gray-500 mb-3">
                {userGroup.members.length} members
              </p>
              <div className="flex flex-wrap gap-2">
                {userGroup.members.map((member) => (
                  <span
                    key={member._id}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {member.name}
                    {member._id === userGroup.leader._id && (
                      <StarIcon className="ml-1 h-3 w-3" />
                    )}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  to="/groups"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Manage Group →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/books"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-600">
                  <BookOpenIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  Browse Books
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Explore our collection of books
                </p>
              </div>
            </Link>

            <Link
              to="/my-books"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600">
                  <BookOpenIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  My Books
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  View your borrowing history
                </p>
              </div>
            </Link>

            <Link
              to="/groups"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600">
                  <UserGroupIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  Groups
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Manage your group membership
                </p>
              </div>
            </Link>

            <Link
              to="/feedback"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg border border-gray-200 hover:border-gray-300"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-600">
                  <StarIcon className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium">
                  Feedback
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Share your thoughts with us
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

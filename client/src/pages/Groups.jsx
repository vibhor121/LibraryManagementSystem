import { useState, useEffect } from 'react'
import { groupService } from '../services/groupService'
import LoadingSpinner from '../components/LoadingSpinner'
import { UserGroupIcon, PlusIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import ManageGroupModal from './ManageGroupModal'
import BorrowedBooksModal from './BorrowedBooksModal'


// const Groups = () => {
//   const [userGroup, setUserGroup] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [creating, setCreating] = useState(false)

//   useEffect(() => {
//     fetchUserGroup()
//   }, [])

//   // GET API - fetch user's group
//   const fetchUserGroup = async () => {
//     try {
//       setLoading(true)
//       const response = await groupService.getMyGroup()
//       setUserGroup(response.data.data.group)
//     } catch (error) {
//       setUserGroup(null)
//       // Optionally show toast if needed
//       // toast.error(error.response?.data?.message || 'Failed to fetch group')
//     } finally {
//       setLoading(false)
//     }
//   }

//   // POST API - create a new group
//   const createGroup = async () => {
//     const groupName = prompt('Enter a group name:')
//     if (!groupName) return

//     const memberIdsString = prompt('Enter member IDs separated by commas:')
//     if (!memberIdsString) return

//     const memberIds = memberIdsString.split(',').map(id => id.trim())

//     try {
//       setCreating(true)
//       const response = await groupService.createGroup({ name: groupName, memberIds })
//       toast.success(response.data.message)
//       fetchUserGroup() // Refresh group info after creation
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to create group')
//     } finally {
//       setCreating(false)
//     }
//   }

//   if (loading) {
//     return <LoadingSpinner size="lg" className="mt-8" />
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
//           <p className="mt-1 text-sm text-gray-500">
//             Manage your group membership for collaborative borrowing
//           </p>
//         </div>
//       </div>

//       {/* Group Status */}
//       <div className="bg-white shadow rounded-lg">
//         <div className="px-4 py-5 sm:p-6">
//           {userGroup ? (
//             <div className="space-y-4">
//               <h3 className="text-lg font-medium text-gray-900">Your Group</h3>
//               <div className="border border-gray-200 rounded-lg p-4">
//                 <h4 className="text-lg font-medium text-gray-900 mb-2">
//                   {userGroup.name}
//                 </h4>
//                 <p className="text-sm text-gray-500 mb-3">
//                   {userGroup.members.length} members
//                 </p>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {userGroup.members.map((member) => (
//                     <span
//                       key={member._id}
//                       className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
//                     >
//                       {member.name}
//                     </span>
//                   ))}
//                 </div>
//                 <div className="flex space-x-3">
//                   <button
//                     className="btn-primary"
//                     onClick={() => toast('Manage Group clicked')}
//                   >
//                     Manage Group
//                   </button>
//                   <button
//                     className="btn-secondary"
//                     onClick={() => toast('View Borrowed Books clicked')}
//                   >
//                     View Borrowed Books
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No group membership</h3>
//               <p className="mt-1 text-sm text-gray-500">
//                 You're not currently a member of any group.
//               </p>
//               <div className="mt-6">
//                 <button
//                   className="btn-primary flex items-center justify-center"
//                   onClick={createGroup}
//                   disabled={creating}
//                 >
//                   <PlusIcon className="h-5 w-5 mr-2" />
//                   {creating ? 'Creating...' : 'Create New Group'}
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

const Groups = () => {
  const [userGroup, setUserGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showBorrowedModal, setShowBorrowedModal] = useState(false)
  const [borrowedBooks, setBorrowedBooks] = useState([])

  useEffect(() => {
    fetchUserGroup()
  }, [])

  // GET API - fetch user's group
  const fetchUserGroup = async () => {
    try {
      setLoading(true)
      const response = await groupService.getMyGroup()
      setUserGroup(response.data.data.group)
    } catch (error) {
      setUserGroup(null)
    } finally {
      setLoading(false)
    }
  }

  // POST API - create a new group
  const createGroup = async () => {
    const groupName = prompt('Enter a group name:')
    if (!groupName) return

    const memberIdsString = prompt('Enter member IDs separated by commas:')
    if (!memberIdsString) return

    const memberIds = memberIdsString.split(',').map(id => id.trim())

    try {
      setCreating(true)
      const response = await groupService.createGroup({ name: groupName, memberIds })
      toast.success(response.data.message)
      fetchUserGroup()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group')
    } finally {
      setCreating(false)
    }
  }

  // FETCH borrowed books for group
  const handleViewBorrowed = async () => {
    try {
      const res = await groupService.getBorrowedBooks(userGroup._id)
      setBorrowedBooks(res.data.data.books)
      setShowBorrowedModal(true)
    } catch (error) {
      toast.error('Failed to fetch borrowed books')
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
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your group membership for collaborative borrowing
          </p>
        </div>
      </div>

      {/* Group Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {userGroup ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Your Group</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  {userGroup.name}
                </h4>
                <p className="text-sm text-gray-500 mb-3">
                  {userGroup.members.length} members
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {userGroup.members.map((member) => (
                    <span
                      key={member._id}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {member.name}
                    </span>
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button
                    className="btn-primary"
                    onClick={() => setShowManageModal(true)}
                  >
                    Manage Group
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleViewBorrowed}
                  >
                    View Borrowed Books
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No group membership
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                You're not currently a member of any group.
              </p>
              <div className="mt-6">
                <button
                  className="btn-primary flex items-center justify-center"
                  onClick={createGroup}
                  disabled={creating}
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  {creating ? 'Creating...' : 'Create New Group'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showManageModal && (
        <ManageGroupModal
          group={userGroup}
          onClose={() => setShowManageModal(false)}
          onUpdate={fetchUserGroup}
        />
      )}

      {showBorrowedModal && (
        <BorrowedBooksModal
          books={borrowedBooks}
          onClose={() => setShowBorrowedModal(false)}
        />
      )}
    </div>
  )
}




export default Groups

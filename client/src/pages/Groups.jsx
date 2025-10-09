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
//   const [showManageModal, setShowManageModal] = useState(false)
//   const [showBorrowedModal, setShowBorrowedModal] = useState(false)
//   const [borrowedBooks, setBorrowedBooks] = useState([])

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
//       fetchUserGroup()
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to create group')
//     } finally {
//       setCreating(false)
//     }
//   }

//   // FETCH borrowed books for group
//   const handleViewBorrowed = async () => {
//     try {
//       const res = await groupService.getBorrowedBooks(userGroup._id)
//       setBorrowedBooks(res.data.data.books)
//       setShowBorrowedModal(true)
//     } catch (error) {
//       toast.error('Failed to fetch borrowed books')
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

//       {/* Group Section */}
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
//                     onClick={() => setShowManageModal(true)}
//                   >
//                     Manage Group
//                   </button>
//                   <button
//                     className="btn-secondary"
//                     onClick={handleViewBorrowed}
//                   >
//                     View Borrowed Books
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="text-center py-12">
//               <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-sm font-medium text-gray-900">
//                 No group membership
//               </h3>
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

//       {/* Modals */}
//       {showManageModal && (
//         <ManageGroupModal
//           group={userGroup}
//           onClose={() => setShowManageModal(false)}
//           onUpdate={fetchUserGroup}
//         />
//       )}

//       {showBorrowedModal && (
//         <BorrowedBooksModal
//           books={borrowedBooks}
//           onClose={() => setShowBorrowedModal(false)}
//         />
//       )}
//     </div>
//   )
// }


const Groups = () => {
  const [userGroup, setUserGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showManageModal, setShowManageModal] = useState(false)
  const [showBorrowedModal, setShowBorrowedModal] = useState(false)
  const [borrowedBooks, setBorrowedBooks] = useState([])

  // Create Group form state
  const [groupName, setGroupName] = useState('')
  const [memberIds, setMemberIds] = useState([''])

  useEffect(() => {
    fetchUserGroup()
  }, [])

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

  const createGroup = async (e) => {
    e.preventDefault()
    if (!groupName.trim()) {
      toast.error('Please enter a group name')
      return
    }

    const filteredIds = memberIds.filter((id) => id.trim() !== '')
    if (filteredIds.length === 0) {
      toast.error('Please add at least one member ID')
      return
    }

    try {
      setCreating(true)
      const response = await groupService.createGroup({ name: groupName, memberIds: filteredIds })
      toast.success(response.data.message || 'Group created successfully!')
      setShowCreateModal(false)
      setGroupName('')
      setMemberIds([''])
      fetchUserGroup()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group')
    } finally {
      setCreating(false)
    }
  }

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
    <div className="space-y-8 px-4 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6 flex items-center justify-between flex-wrap">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserGroupIcon className="h-7 w-7 text-white" />
            Groups
          </h1>
          <p className="mt-1 text-sm text-indigo-200">
            Manage your group membership for collaborative borrowing.
          </p>
        </div>
      </div>

      {/* Group Section */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        {userGroup ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Group</h3>
            <div className="border border-gray-200 rounded-xl p-5 hover:shadow-xl transition-shadow duration-300 bg-gray-50">
              <h4 className="text-xl font-bold text-indigo-700 mb-2">{userGroup.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{userGroup.members.length} Members</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {userGroup.members.map((member) => (
                  <span
                    key={member._id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {member.name}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => setShowManageModal(true)}
                >
                  Manage Group
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg shadow-md transition transform hover:-translate-y-1 hover:scale-105"
                  onClick={handleViewBorrowed}
                >
                  View Borrowed Books
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-14 w-14 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-gray-900">No Group Membership</h3>
            <p className="mt-1 text-gray-500">
              You're not currently a member of any group.
            </p>
            <div className="mt-6">
              <button
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-lg transition transform hover:-translate-y-1 hover:scale-105 hover:bg-indigo-700"
                onClick={() => setShowCreateModal(true)}
              >
                <PlusIcon className="h-5 w-5" />
                Create New Group
              </button>
            </div>
          </div>
        )}
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
        <BorrowedBooksModal books={borrowedBooks} onClose={() => setShowBorrowedModal(false)} />
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Create New Group
            </h2>
            <form onSubmit={createGroup} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Group Name</label>
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member IDs</label>
                {memberIds.map((id, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Enter member ID"
                      value={id}
                      onChange={(e) => {
                        const newIds = [...memberIds]
                        newIds[index] = e.target.value
                        setMemberIds(newIds)
                      }}
                      className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => setMemberIds(memberIds.filter((_, i) => i !== index))}
                        className="bg-red-500 text-white px-4 rounded-xl hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setMemberIds([...memberIds, ''])}
                  className="text-indigo-600 hover:underline text-sm font-medium"
                >
                  + Add another member
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Groups



import { useState, useEffect } from 'react'
import { groupService, userService } from '../../services/groupService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserPlusIcon,
  UserMinusIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const AdminGroups = () => {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  // Create/Edit form state
  const [formData, setFormData] = useState({
    name: '',
    memberIds: [],
    leaderId: ''
  })
  const [selectedMembers, setSelectedMembers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await groupService.getAllGroups()
      setGroups(response.data.data.groups)
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast.error('Failed to fetch groups')
    } finally {
      setLoading(false)
    }
  }

  // Search users with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsSearching(true)
        const response = await userService.searchUsers(searchQuery)
        setSearchResults(response.data.data.users)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleAddMember = (user) => {
    if (selectedMembers.find(member => member._id === user._id)) {
      toast.error('User is already added to the group')
      return
    }

    if (selectedMembers.length >= 5) {
      toast.error('Group can have maximum 6 members')
      return
    }

    setSelectedMembers([...selectedMembers, user])
    setSearchQuery('')
    setSearchResults([])
  }

  const handleRemoveMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(member => member._id !== userId))
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name')
      return
    }

    if (selectedMembers.length < 2) {
      toast.error('Group must have at least 3 members')
      return
    }

    if (!formData.leaderId) {
      toast.error('Please select a group leader')
      return
    }

    try {
      setIsSubmitting(true)
      const memberIds = selectedMembers.map(member => member._id)
      const response = await groupService.createGroup({ 
        name: formData.name.trim(), 
        memberIds,
        leaderId: formData.leaderId
      })
      
      toast.success(response.data.message || 'Group created successfully!')
      setShowCreateModal(false)
      resetForm()
      fetchGroups()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditGroup = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter a group name')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await groupService.updateGroup(selectedGroup._id, {
        name: formData.name.trim(),
        leaderId: formData.leaderId
      })
      
      toast.success(response.data.message || 'Group updated successfully!')
      setShowEditModal(false)
      resetForm()
      fetchGroups()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update group')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      return
    }

    try {
      await groupService.disbandGroup(groupId)
      toast.success('Group deleted successfully!')
      fetchGroups()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete group')
    }
  }

  const resetForm = () => {
    setFormData({ name: '', memberIds: [], leaderId: '' })
    setSelectedMembers([])
    setSearchQuery('')
    setSearchResults([])
    setSelectedGroup(null)
  }

  const openEditModal = (group) => {
    setSelectedGroup(group)
    setFormData({
      name: group.name,
      memberIds: group.members.map(m => m._id),
      leaderId: group.leader._id
    })
    setSelectedMembers(group.members)
    setShowEditModal(true)
  }

  const openCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  if (loading) {
    return <LoadingSpinner size="lg" className="mt-8" />
  }

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 py-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserGroupIcon className="h-8 w-8" />
              Manage Groups
            </h1>
            <p className="mt-1 text-sm text-indigo-200">
              Create and manage user groups for collaborative borrowing
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-indigo-50 transition transform hover:-translate-y-1 hover:scale-105 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Group
          </button>
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No groups</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new group.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Group Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {groups.map((group) => (
                  <tr key={group._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{group.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {group.leader ? (
                          <>
                            <StarIcon className="h-4 w-4 text-yellow-500 mr-2" />
                            <span className="text-sm text-gray-900">{group.leader.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">No leader assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {group.members.map((member) => (
                          <span
                            key={member._id}
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              group.leader && member._id === group.leader._id
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {member.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(group)}
                          className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleCreateGroup} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Members *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserPlusIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-xl bg-white shadow-lg max-h-48 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleAddMember(user)}
                        >
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <UserPlusIcon className="h-5 w-5 text-indigo-500" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedMembers.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selected Members ({selectedMembers.length}/6)
                    </label>
                    <div className="space-y-2">
                      {selectedMembers.map((member) => (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="leader"
                              value={member._id}
                              checked={formData.leaderId === member._id}
                              onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                              className="text-indigo-600 focus:ring-indigo-500"
                            />
                            <div>
                              <p className="font-medium text-indigo-900">{member.name}</p>
                              <p className="text-sm text-indigo-600">{member.email}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMember(member._id)}
                            className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
                          >
                            <UserMinusIcon className="h-4 w-4 text-indigo-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Group Requirements</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Groups must have 3-6 members</li>
                    <li>• All members must have no unpaid fines</li>
                    <li>• Members cannot be in other active groups</li>
                    <li>• Group borrowing allows 6 months (180 days)</li>
                    <li>• Only one book can be borrowed per group at a time</li>
                  </ul>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={isSubmitting || selectedMembers.length < 2 || !formData.leaderId}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? 'Creating...' : `Create Group (${selectedMembers.length} members)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Edit Group</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleEditGroup} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter group name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Leader *
                  </label>
                  <select
                    value={formData.leaderId}
                    onChange={(e) => setFormData({ ...formData, leaderId: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  >
                    <option value="">Select a leader</option>
                    {selectedMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name} ({member.email})
                      </option>
                    ))}
                  </select>
                </div>
              </form>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleEditGroup}
                disabled={isSubmitting || !formData.leaderId}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? 'Updating...' : 'Update Group'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminGroups

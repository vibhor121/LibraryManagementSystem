import { useState, useEffect } from 'react'
import { groupService, userService } from '../services/groupService'
import { XMarkIcon, MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const CreateGroupModal = ({ isOpen, onClose, onSuccess }) => {
  const [groupName, setGroupName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedMembers, setSelectedMembers] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

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
    // Check if user is already selected
    if (selectedMembers.find(member => member._id === user._id)) {
      toast.error('User is already added to the group')
      return
    }

    // Check if we've reached the maximum (5 additional members + leader = 6 total)
    if (selectedMembers.length >= 5) {
      toast.error('Group can have maximum 6 members (including you)')
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
    
    if (!groupName.trim()) {
      toast.error('Please enter a group name')
      return
    }

    if (selectedMembers.length < 2) {
      toast.error('Group must have at least 3 members (including you)')
      return
    }

    try {
      setIsCreating(true)
      const memberIds = selectedMembers.map(member => member._id)
      const response = await groupService.createGroup({ 
        name: groupName.trim(), 
        memberIds 
      })
      
      toast.success(response.data.message || 'Group created successfully!')
      onSuccess()
      handleClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create group')
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    setGroupName('')
    setSearchQuery('')
    setSearchResults([])
    setSelectedMembers([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Group</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleCreateGroup} className="space-y-6">
            {/* Group Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                placeholder="Enter group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                maxLength={100}
              />
            </div>

            {/* Member Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Members *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Search Results */}
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

              {isSearching && (
                <div className="mt-2 text-center py-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span className="ml-2 text-sm text-gray-500">Searching...</span>
                </div>
              )}
            </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Members ({selectedMembers.length}/5)
                </label>
                <div className="space-y-2">
                  {selectedMembers.map((member) => (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-indigo-900">{member.name}</p>
                        <p className="text-sm text-indigo-600">{member.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member._id)}
                        className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4 text-indigo-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Group Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">Group Requirements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Groups must have 3-6 members (including you)</li>
                <li>• All members must have no unpaid fines</li>
                <li>• Members cannot be in other active groups</li>
                <li>• Group borrowing allows 6 months (180 days)</li>
                <li>• Only one book can be borrowed per group at a time</li>
              </ul>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateGroup}
            disabled={isCreating || selectedMembers.length < 2}
            className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {isCreating ? 'Creating...' : `Create Group (${selectedMembers.length + 1} members)`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateGroupModal

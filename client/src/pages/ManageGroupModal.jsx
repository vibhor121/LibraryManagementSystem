import React, { useState } from 'react'
import { groupService } from '../services/groupService'
import { toast } from 'react-hot-toast'

const ManageGroupModal = ({ group, onClose, onUpdate }) => {
  const [newMemberId, setNewMemberId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAddMember = async () => {
    if (!newMemberId) return
    try {
      setLoading(true)
      await groupService.addMember(group._id, newMemberId)
      toast.success('Member added successfully')
      setNewMemberId('')
      onUpdate()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveMember = async (memberId) => {
    try {
      await groupService.removeMember(group._id, memberId)
      toast.success('Member removed')
      onUpdate()
    } catch (error) {
      toast.error('Error removing member')
    }
  }

  const handleDisband = async () => {
    if (!window.confirm('Are you sure you want to disband the group?')) return
    try {
      await groupService.disbandGroup(group._id)
      toast.success('Group disbanded')
      onClose()
      onUpdate()
    } catch (error) {
      toast.error('Error disbanding group')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">{group.name}</h2>

        <h3 className="font-semibold mb-2">Members:</h3>
        <ul className="mb-4 max-h-48 overflow-y-auto">
          {group.members.map((member) => (
            <li key={member._id} className="flex justify-between items-center mb-1">
              <span>{member.name}</span>
              <button
                className="text-red-500 text-sm"
                onClick={() => handleRemoveMember(member._id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          placeholder="Enter member ID"
          value={newMemberId}
          onChange={(e) => setNewMemberId(e.target.value)}
          className="border p-2 w-full rounded mb-2"
        />
        <button
          onClick={handleAddMember}
          disabled={loading}
          className="btn-primary w-full mb-3"
        >
          {loading ? 'Adding...' : 'Add Member'}
        </button>

        <button className="btn-secondary w-full mb-3" onClick={handleDisband}>
          Disband Group
        </button>

        <button onClick={onClose} className="btn-outline w-full">
          Close
        </button>
      </div>
    </div>
  )
}

export default ManageGroupModal

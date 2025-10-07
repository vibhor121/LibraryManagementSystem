import api from './api'

export const groupService = {
  // Create group
  createGroup: (groupData) => {
    return api.post('/groups', groupData)
  },

  // Get user's group
  getMyGroup: () => {
    return api.get('/groups/my-group')
  },

  // Add member to group
  addMember: (groupId, memberId) => {
    return api.put(`/groups/${groupId}/add-member`, { memberId })
  },

  // Remove member from group
  removeMember: (groupId, memberId) => {
    return api.put(`/groups/${groupId}/remove-member`, { memberId })
  },

  // Transfer group leadership
  transferLeadership: (groupId, newLeaderId) => {
    return api.put(`/groups/${groupId}/transfer-leadership`, { newLeaderId })
  },

  // Leave group
  leaveGroup: (groupId) => {
    return api.put(`/groups/${groupId}/leave`)
  },

  // Disband group
  disbandGroup: (groupId) => {
    return api.delete(`/groups/${groupId}`)
  }
}

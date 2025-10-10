import api from './api'

// export const groupService = {
//   // Create group
//   createGroup: (groupData) => {
//     return api.post('/groups', groupData)
//   },

//   // Get user's group
//   getMyGroup: () => {
//     return api.get('/groups/my-group')
//   },

//   // Add member to group
//   addMember: (groupId, memberId) => {
//     return api.put(`/groups/${groupId}/add-member`, { memberId })
//   },

//   // Remove member from group
//   removeMember: (groupId, memberId) => {
//     return api.put(`/groups/${groupId}/remove-member`, { memberId })
//   },

//   // Transfer group leadership
//   transferLeadership: (groupId, newLeaderId) => {
//     return api.put(`/groups/${groupId}/transfer-leadership`, { newLeaderId })
//   },

//   // Leave group
//   leaveGroup: (groupId) => {
//     return api.put(`/groups/${groupId}/leave`)
//   },

//   // Disband group
//   disbandGroup: (groupId) => {
//     return api.delete(`/groups/${groupId}`)
//   }
// }

 // Adjust path to your axios instance

export const groupService = {
  // Admin: Get all groups
  getAllGroups: () => api.get('/groups'),

  // Admin: Get single group
  getGroup: (groupId) => api.get(`/groups/${groupId}`),

  // Admin: Create a new group
  createGroup: (groupData) => api.post('/groups', groupData),

  // Admin: Update group
  updateGroup: (groupId, groupData) => api.put(`/groups/${groupId}`, groupData),

  // Admin: Add a member to group
  addMember: (groupId, memberId) =>
    api.put(`/groups/${groupId}/add-member`, { memberId }),

  // Admin: Remove a member from group
  removeMember: (groupId, memberId) =>
    api.put(`/groups/${groupId}/remove-member`, { memberId }),

  // Admin: Transfer leadership
  transferLeadership: (groupId, newLeaderId) =>
    api.put(`/groups/${groupId}/transfer-leadership`, { newLeaderId }),

  // Admin: Leave group (remove user)
  leaveGroup: (groupId) => api.put(`/groups/${groupId}/leave`),

  // Admin: Disband a group
  disbandGroup: (groupId) => api.delete(`/groups/${groupId}`),

  // User: Get logged-in user's group
  getMyGroup: () => api.get('/groups/my-group'),

  // Get borrowed books for a group
  getBorrowedBooks: (groupId) => api.get(`/groups/${groupId}/borrowed-books`),
}

// User search service for group invitations
export const userService = {
  // Search users for group invitations
  searchUsers: (query, limit = 10) => api.get(`/users/search?q=${encodeURIComponent(query)}&limit=${limit}`),
}

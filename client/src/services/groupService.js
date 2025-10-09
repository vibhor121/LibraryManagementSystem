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
  // Create a new group
  createGroup: (groupData) => api.post('/groups', groupData),

  // Get logged-in user's group
  getMyGroup: () => api.get('/groups/my-group'),

  // Add a member to group
  addMember: (groupId, memberId) =>
    api.put(`/groups/${groupId}/add-member`, { memberId }),

  // Remove a member from group
  removeMember: (groupId, memberId) =>
    api.put(`/groups/${groupId}/remove-member`, { memberId }),

  // Transfer leadership
  transferLeadership: (groupId, newLeaderId) =>
    api.put(`/groups/${groupId}/transfer-leadership`, { newLeaderId }),

  // Leave a group
  leaveGroup: (groupId) => api.put(`/groups/${groupId}/leave`),

  // Disband a group
  disbandGroup: (groupId) => api.delete(`/groups/${groupId}`),

  // Get borrowed books for a group
  getBorrowedBooks: (groupId) => api.get(`/groups/${groupId}/borrowed-books`),
}

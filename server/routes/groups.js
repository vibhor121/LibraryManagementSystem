// const express = require('express');
// const { body, validationResult } = require('express-validator');
// const Group = require('../models/Group');
// const User = require('../models/User');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// // @desc    Create a new group
// // @route   POST /api/groups
// // @access  Private
// router.post('/', protect, [
//   body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Group name must be between 2 and 100 characters'),
//   body('memberIds').isArray({ min: 2, max: 5 }).withMessage('Group must have 2-5 additional members (3-6 total including you)')
// ], async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { name, memberIds } = req.body;
//     const leaderId = req.user._id;

//     // Check if user is already in a group
//     const existingGroup = await Group.findOne({
//       members: leaderId,
//       isActive: true
//     });

//     if (existingGroup) {
//       return res.status(400).json({
//         success: false,
//         message: 'You are already a member of an active group'
//       });
//     }

//     // Validate member IDs and check if they exist
//     const members = await User.find({
//       _id: { $in: memberIds },
//       isActive: true
//     });

//     if (members.length !== memberIds.length) {
//       return res.status(400).json({
//         success: false,
//         message: 'One or more member IDs are invalid'
//       });
//     }

//     // Check if any member is already in a group
//     for (const member of members) {
//       const memberGroup = await Group.findOne({
//         members: member._id,
//         isActive: true
//       });

//       if (memberGroup) {
//         return res.status(400).json({
//           success: false,
//           message: `User ${member.name} is already a member of another group`
//         });
//       }
//     }

//     // Add leader to members array
//     const allMembers = [leaderId, ...memberIds];

//     // Create group
//     const group = await Group.create({
//       name,
//       members: allMembers,
//       leader: leaderId
//     });

//     // Populate the group for response
//     await group.populate('members', 'name email phone');
//     await group.populate('leader', 'name email');

//     res.status(201).json({
//       success: true,
//       message: 'Group created successfully',
//       data: { group }
//     });
//   } catch (error) {
//     console.error('Create group error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Get user's group
// // @route   GET /api/groups/my-group
// // @access  Private
// router.get('/my-group', protect, async (req, res) => {
//   try {
//     const group = await Group.findOne({
//       members: req.user._id,
//       isActive: true
//     })
//       .populate('members', 'name email phone totalFines')
//       .populate('leader', 'name email')
//       .populate('borrowedBooks');

//     if (!group) {
//       return res.status(404).json({
//         success: false,
//         message: 'You are not a member of any group'
//       });
//     }

//     res.json({
//       success: true,
//       data: { group }
//     });
//   } catch (error) {
//     console.error('Get user group error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Add member to group
// // @route   PUT /api/groups/:id/add-member
// // @access  Private
// router.put('/:id/add-member', protect, [
//   body('memberId').isMongoId().withMessage('Valid member ID is required')
// ], async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { memberId } = req.body;
//     const groupId = req.params.id;
//     const userId = req.user._id;

//     // Find group
//     const group = await Group.findById(groupId);
//     if (!group || !group.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found'
//       });
//     }

//     // Check if user is the group leader
//     if (group.leader.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Only group leader can add members'
//       });
//     }

//     // Check if group can add more members
//     if (group.members.length >= group.maxMembers) {
//       return res.status(400).json({
//         success: false,
//         message: 'Group has reached maximum capacity'
//       });
//     }

//     // Check if member exists and is active
//     const member = await User.findById(memberId);
//     if (!member || !member.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Member not found'
//       });
//     }

//     // Check if member is already in a group
//     const existingGroup = await Group.findOne({
//       members: memberId,
//       isActive: true
//     });

//     if (existingGroup) {
//       return res.status(400).json({
//         success: false,
//         message: 'User is already a member of another group'
//       });
//     }

//     // Add member to group
//     group.members.push(memberId);
//     await group.save();

//     // Populate the updated group
//     await group.populate('members', 'name email phone totalFines');
//     await group.populate('leader', 'name email');

//     res.json({
//       success: true,
//       message: 'Member added successfully',
//       data: { group }
//     });
//   } catch (error) {
//     console.error('Add member error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Remove member from group
// // @route   PUT /api/groups/:id/remove-member
// // @access  Private
// router.put('/:id/remove-member', protect, [
//   body('memberId').isMongoId().withMessage('Valid member ID is required')
// ], async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { memberId } = req.body;
//     const groupId = req.params.id;
//     const userId = req.user._id;

//     // Find group
//     const group = await Group.findById(groupId);
//     if (!group || !group.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found'
//       });
//     }

//     // Check if user is the group leader or the member being removed
//     const canRemove = group.leader.toString() === userId.toString() || 
//                      memberId === userId.toString();

//     if (!canRemove) {
//       return res.status(403).json({
//         success: false,
//         message: 'You are not authorized to remove this member'
//       });
//     }

//     // Check if member is in the group
//     const memberIndex = group.members.findIndex(
//       member => member.toString() === memberId
//     );

//     if (memberIndex === -1) {
//       return res.status(400).json({
//         success: false,
//         message: 'Member is not in this group'
//       });
//     }

//     // Check if removing the leader
//     if (group.leader.toString() === memberId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Group leader cannot be removed. Transfer leadership first.'
//       });
//     }

//     // Check if group will have less than minimum members after removal
//     if (group.members.length <= 3) {
//       return res.status(400).json({
//         success: false,
//         message: 'Group must have at least 3 members'
//       });
//     }

//     // Remove member from group
//     group.members.splice(memberIndex, 1);
//     await group.save();

//     // Populate the updated group
//     await group.populate('members', 'name email phone totalFines');
//     await group.populate('leader', 'name email');

//     res.json({
//       success: true,
//       message: 'Member removed successfully',
//       data: { group }
//     });
//   } catch (error) {
//     console.error('Remove member error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Transfer group leadership
// // @route   PUT /api/groups/:id/transfer-leadership
// // @access  Private
// router.put('/:id/transfer-leadership', protect, [
//   body('newLeaderId').isMongoId().withMessage('Valid new leader ID is required')
// ], async (req, res) => {
//   try {
//     // Check for validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation failed',
//         errors: errors.array()
//       });
//     }

//     const { newLeaderId } = req.body;
//     const groupId = req.params.id;
//     const userId = req.user._id;

//     // Find group
//     const group = await Group.findById(groupId);
//     if (!group || !group.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found'
//       });
//     }

//     // Check if user is the current group leader
//     if (group.leader.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Only group leader can transfer leadership'
//       });
//     }

//     // Check if new leader is a member of the group
//     const isMember = group.members.some(
//       member => member.toString() === newLeaderId
//     );

//     if (!isMember) {
//       return res.status(400).json({
//         success: false,
//         message: 'New leader must be a member of the group'
//       });
//     }

//     // Transfer leadership
//     group.leader = newLeaderId;
//     await group.save();

//     // Populate the updated group
//     await group.populate('members', 'name email phone totalFines');
//     await group.populate('leader', 'name email');

//     res.json({
//       success: true,
//       message: 'Leadership transferred successfully',
//       data: { group }
//     });
//   } catch (error) {
//     console.error('Transfer leadership error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Leave group
// // @route   PUT /api/groups/:id/leave
// // @access  Private
// router.put('/:id/leave', protect, async (req, res) => {
//   try {
//     const groupId = req.params.id;
//     const userId = req.user._id;

//     // Find group
//     const group = await Group.findById(groupId);
//     if (!group || !group.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found'
//       });
//     }

//     // Check if user is a member of the group
//     const memberIndex = group.members.findIndex(
//       member => member.toString() === userId.toString()
//     );

//     if (memberIndex === -1) {
//       return res.status(400).json({
//         success: false,
//         message: 'You are not a member of this group'
//       });
//     }

//     // Check if user is the leader
//     if (group.leader.toString() === userId.toString()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Group leader cannot leave. Transfer leadership first or disband the group.'
//       });
//     }

//     // Check if group will have less than minimum members after leaving
//     if (group.members.length <= 3) {
//       return res.status(400).json({
//         success: false,
//         message: 'Group must have at least 3 members. You cannot leave.'
//       });
//     }

//     // Remove user from group
//     group.members.splice(memberIndex, 1);
//     await group.save();

//     res.json({
//       success: true,
//       message: 'You have left the group successfully'
//     });
//   } catch (error) {
//     console.error('Leave group error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// // @desc    Disband group
// // @route   DELETE /api/groups/:id
// // @access  Private
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const groupId = req.params.id;
//     const userId = req.user._id;

//     // Find group
//     const group = await Group.findById(groupId);
//     if (!group || !group.isActive) {
//       return res.status(404).json({
//         success: false,
//         message: 'Group not found'
//       });
//     }

//     // Check if user is the group leader
//     if (group.leader.toString() !== userId.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Only group leader can disband the group'
//       });
//     }

//     // Check if group has active borrow records
//     const BorrowRecord = require('../models/BorrowRecord');
//     const activeBorrows = await BorrowRecord.countDocuments({
//       group: groupId,
//       status: { $in: ['borrowed', 'overdue'] }
//     });

//     if (activeBorrows > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'Cannot disband group with active borrow records'
//       });
//     }

//     // Disband group (soft delete)
//     group.isActive = false;
//     await group.save();

//     res.json({
//       success: true,
//       message: 'Group disbanded successfully'
//     });
//   } catch (error) {
//     console.error('Disband group error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Server error'
//     });
//   }
// });

// module.exports = router;


const express = require('express');
const { body, validationResult } = require('express-validator');
const Group = require('../models/Group');
const User = require('../models/User');
const BorrowRecord = require('../models/BorrowRecord');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @desc    Create a new group
 * @route   POST /api/groups
 * @access  Private
 */
router.post(
  '/',
  protect,
  [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Group name must be between 2 and 100 characters'),
    body('memberIds')
      .isArray({ min: 2, max: 5 })
      .withMessage('Group must have 2-5 additional members (3-6 total including you)'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }

      const { name, memberIds } = req.body;
      const leaderId = req.user._id;

      // Check if user is already in an active group
      const existingGroup = await Group.findOne({ members: leaderId, isActive: true });
      if (existingGroup) {
        return res.status(400).json({ success: false, message: 'You are already a member of an active group' });
      }

      // Validate member IDs exist
      const members = await User.find({ _id: { $in: memberIds }, isActive: true });
      if (members.length !== memberIds.length) {
        return res.status(400).json({ success: false, message: 'One or more member IDs are invalid' });
      }

      // Check if any member is already in an active group
      for (const member of members) {
        const memberGroup = await Group.findOne({ members: member._id, isActive: true });
        if (memberGroup) {
          return res.status(400).json({
            success: false,
            message: `User ${member.name} is already a member of another group`,
          });
        }
      }

      // Create group
      const allMembers = [leaderId, ...memberIds];
      const group = await Group.create({ name, members: allMembers, leader: leaderId });

      await group.populate('members', 'name email phone');
      await group.populate('leader', 'name email');

      res.status(201).json({ success: true, message: 'Group created successfully', data: { group } });
    } catch (error) {
      console.error('Create group error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * @desc    Get user's active group
 * @route   GET /api/groups/my-group
 * @access  Private
 */
router.get('/my-group', protect, async (req, res) => {
  try {
    const group = await Group.findOne({ members: req.user._id, isActive: true })
      .populate('members', 'name email phone totalFines')
      .populate('leader', 'name email')
      .populate('borrowedBooks');

    if (!group) {
      return res.status(404).json({ success: false, message: 'You are not a member of any group' });
    }

    res.json({ success: true, data: { group } });
  } catch (error) {
    console.error('Get user group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @desc    Add member to group
 * @route   PUT /api/groups/:id/add-member
 * @access  Private
 */
router.put(
  '/:id/add-member',
  protect,
  [body('memberId').isMongoId().withMessage('Valid member ID is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
      }

      const { memberId } = req.body;
      const group = await Group.findById(req.params.id);

      if (!group || !group.isActive) return res.status(404).json({ success: false, message: 'Group not found' });
      if (group.leader.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Only group leader can add members' });
      if (group.members.length >= group.maxMembers) return res.status(400).json({ success: false, message: 'Group has reached maximum capacity' });

      const member = await User.findById(memberId);
      if (!member || !member.isActive) return res.status(404).json({ success: false, message: 'Member not found' });

      const existingGroup = await Group.findOne({ members: memberId, isActive: true });
      if (existingGroup) return res.status(400).json({ success: false, message: 'User is already a member of another group' });

      group.members.push(memberId);
      await group.save();
      await group.populate('members', 'name email phone totalFines');
      await group.populate('leader', 'name email');

      res.json({ success: true, message: 'Member added successfully', data: { group } });
    } catch (error) {
      console.error('Add member error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * @desc    Remove member from group
 * @route   PUT /api/groups/:id/remove-member
 * @access  Private
 */
router.put(
  '/:id/remove-member',
  protect,
  [body('memberId').isMongoId().withMessage('Valid member ID is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

      const { memberId } = req.body;
      const group = await Group.findById(req.params.id);

      if (!group || !group.isActive) return res.status(404).json({ success: false, message: 'Group not found' });

      const canRemove = group.leader.toString() === req.user._id.toString() || memberId === req.user._id.toString();
      if (!canRemove) return res.status(403).json({ success: false, message: 'You are not authorized to remove this member' });

      const memberIndex = group.members.findIndex(m => m.toString() === memberId);
      if (memberIndex === -1) return res.status(400).json({ success: false, message: 'Member is not in this group' });
      if (group.leader.toString() === memberId) return res.status(400).json({ success: false, message: 'Group leader cannot be removed. Transfer leadership first.' });
      if (group.members.length <= 3) return res.status(400).json({ success: false, message: 'Group must have at least 3 members' });

      group.members.splice(memberIndex, 1);
      await group.save();
      await group.populate('members', 'name email phone totalFines');
      await group.populate('leader', 'name email');

      res.json({ success: true, message: 'Member removed successfully', data: { group } });
    } catch (error) {
      console.error('Remove member error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * @desc    Transfer group leadership
 * @route   PUT /api/groups/:id/transfer-leadership
 * @access  Private
 */
router.put(
  '/:id/transfer-leadership',
  protect,
  [body('newLeaderId').isMongoId().withMessage('Valid new leader ID is required')],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

      const { newLeaderId } = req.body;
      const group = await Group.findById(req.params.id);

      if (!group || !group.isActive) return res.status(404).json({ success: false, message: 'Group not found' });
      if (group.leader.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Only group leader can transfer leadership' });

      const isMember = group.members.some(m => m.toString() === newLeaderId);
      if (!isMember) return res.status(400).json({ success: false, message: 'New leader must be a member of the group' });

      group.leader = newLeaderId;
      await group.save();
      await group.populate('members', 'name email phone totalFines');
      await group.populate('leader', 'name email');

      res.json({ success: true, message: 'Leadership transferred successfully', data: { group } });
    } catch (error) {
      console.error('Transfer leadership error:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/**
 * @desc    Leave group
 * @route   PUT /api/groups/:id/leave
 * @access  Private
 */
router.put('/:id/leave', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group || !group.isActive) return res.status(404).json({ success: false, message: 'Group not found' });

    const userId = req.user._id.toString();
    const memberIndex = group.members.findIndex(m => m.toString() === userId);
    if (memberIndex === -1) return res.status(400).json({ success: false, message: 'You are not a member of this group' });

    if (group.leader.toString() === userId) return res.status(400).json({ success: false, message: 'Group leader cannot leave. Transfer leadership first or disband the group.' });
    if (group.members.length <= 3) return res.status(400).json({ success: false, message: 'Group must have at least 3 members. You cannot leave.' });

    group.members.splice(memberIndex, 1);
    await group.save();

    res.json({ success: true, message: 'You have left the group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @desc    Disband group
 * @route   DELETE /api/groups/:id
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group || !group.isActive) return res.status(404).json({ success: false, message: 'Group not found' });

    if (group.leader.toString() !== req.user._id.toString()) return res.status(403).json({ success: false, message: 'Only group leader can disband the group' });

    const activeBorrows = await BorrowRecord.countDocuments({
      group: group._id,
      status: { $in: ['borrowed', 'overdue'] },
    });

    if (activeBorrows > 0) return res.status(400).json({ success: false, message: 'Cannot disband group with active borrow records' });

    group.isActive = false;
    await group.save();

    res.json({ success: true, message: 'Group disbanded successfully' });
  } catch (error) {
    console.error('Disband group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

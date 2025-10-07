const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Group leader is required']
  },
  maxMembers: {
    type: Number,
    default: 6,
    min: [3, 'Group must have at least 3 members'],
    max: [6, 'Group cannot have more than 6 members']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalFines: {
    type: Number,
    default: 0
  },
  borrowedBooks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BorrowRecord'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Validate group size
groupSchema.pre('save', function(next) {
  if (this.members.length < 3 || this.members.length > 6) {
    return next(new Error('Group must have between 3 and 6 members'));
  }
  
  // Ensure leader is a member of the group
  if (!this.members.includes(this.leader)) {
    return next(new Error('Group leader must be a member of the group'));
  }
  
  this.updatedAt = Date.now();
  next();
});

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Virtual for checking if group can add more members
groupSchema.virtual('canAddMembers').get(function() {
  return this.members.length < this.maxMembers;
});

module.exports = mongoose.model('Group', groupSchema);

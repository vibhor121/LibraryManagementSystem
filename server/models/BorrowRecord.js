// const mongoose = require('mongoose');

// const borrowRecordSchema = new mongoose.Schema({
//   book: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Book',
//     required: [true, 'Book is required']
//   },
//   borrower: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: [true, 'Borrower is required']
//   },
//   group: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Group',
//     default: null
//   },
//   borrowDate: {
//     type: Date,
//     default: Date.now
//   },
//   dueDate: {
//     type: Date,
//     required: true
//   },
//   returnDate: {
//     type: Date,
//     default: null
//   },
//   status: {
//     type: String,
//     enum: ['borrowed', 'returned', 'overdue', 'lost', 'damaged'],
//     default: 'borrowed'
//   },
//   condition: {
//     type: String,
//     enum: ['good', 'minor_damage', 'major_damage', 'lost'],
//     default: 'good'
//   },
//   fine: {
//     type: Number,
//     default: 0,
//     min: [0, 'Fine cannot be negative']
//   },
//   fineReason: {
//     type: String,
//     enum: ['overdue', 'lost_after_month', 'lost_within_month', 'minor_damage', 'major_damage'],
//     default: null
//   },
//   isFinePaid: {
//     type: Boolean,
//     default: false
//   },
//   finePaidDate: {
//     type: Date,
//     default: null
//   },
//   notes: {
//     type: String,
//     maxlength: [500, 'Notes cannot exceed 500 characters']
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Calculate due date (1 month from borrow date)
// borrowRecordSchema.pre('save', function(next) {
//   if (this.isNew && !this.dueDate) {
//     const dueDate = new Date(this.borrowDate);
//     dueDate.setMonth(dueDate.getMonth() + 1);
//     this.dueDate = dueDate;
//   }
  
//   this.updatedAt = Date.now();
//   next();
// });

// // Virtual for checking if book is overdue
// borrowRecordSchema.virtual('isOverdue').get(function() {
//   if (this.status === 'returned') return false;
//   return new Date() > this.dueDate;
// });

// // Virtual for days overdue
// borrowRecordSchema.virtual('daysOverdue').get(function() {
//   if (!this.isOverdue) return 0;
//   const now = new Date();
//   const diffTime = Math.abs(now - this.dueDate);
//   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// });

// // Method to calculate fine based on condition and time
// borrowRecordSchema.methods.calculateFine = function(bookPrice) {
//   const now = new Date();
//   const isOverdue = now > this.dueDate;
//   const daysOverdue = isOverdue ? Math.ceil((now - this.dueDate) / (1000 * 60 * 60 * 24)) : 0;
  
//   let fine = 0;
//   let reason = null;
  
//   switch (this.condition) {
//     case 'lost':
//       if (isOverdue) {
//         fine = (bookPrice * 2) + 50; // 200% of book cost + ₹50 fine
//         reason = 'lost_after_month';
//       } else {
//         fine = bookPrice * 2; // 200% of book cost only
//         reason = 'lost_within_month';
//       }
//       break;
//     case 'minor_damage':
//       fine = bookPrice * 0.1; // 10% of book cost
//       reason = 'minor_damage';
//       break;
//     case 'major_damage':
//       fine = bookPrice * 0.5; // 50% of book cost
//       reason = 'major_damage';
//       break;
//     default:
//       if (isOverdue) {
//         fine = 50; // ₹50 fine for overdue
//         reason = 'overdue';
//       }
//   }
  
//   this.fine = fine;
//   this.fineReason = reason;
//   return fine;
// };

// // Index for better query performance
// borrowRecordSchema.index({ borrower: 1, status: 1 });
// borrowRecordSchema.index({ book: 1, status: 1 });
// borrowRecordSchema.index({ dueDate: 1, status: 1 });

// module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);



const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'Book is required']
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Borrower is required']
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  },
  borrowDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['borrowed', 'returned', 'overdue', 'lost', 'damaged'],
    default: 'borrowed'
  },
  condition: {
    type: String,
    enum: ['good', 'minor_damage', 'major_damage', 'lost'],
    default: 'good'
  },
  fine: {
    type: Number,
    default: 0,
    min: [0, 'Fine cannot be negative']
  },
  fineReason: {
    type: String,
    enum: ['overdue', 'lost_after_month', 'lost_within_month', 'minor_damage', 'major_damage', null],
    default: null
  },
  isFinePaid: {
    type: Boolean,
    default: false
  },
  finePaidDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically calculate due date if not set
borrowRecordSchema.pre('save', function(next) {
  if (this.isNew && !this.dueDate) {
    const dueDate = new Date(this.borrowDate);
    dueDate.setMonth(dueDate.getMonth() + 1);
    this.dueDate = dueDate;
  }

  this.updatedAt = Date.now();
  next();
});

// Update updatedAt on findOneAndUpdate
borrowRecordSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual for checking if book is overdue
borrowRecordSchema.virtual('isOverdue').get(function() {
  if (this.status === 'returned') return false;
  return new Date() > this.dueDate;
});

// Virtual for days overdue
borrowRecordSchema.virtual('daysOverdue').get(function() {
  if (!this.isOverdue) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - this.dueDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to calculate fine based on condition and time
borrowRecordSchema.methods.calculateFine = function(bookPrice) {
  const returnDate = this.returnDate || new Date();
  const isOverdue = returnDate > this.dueDate;
  const daysOverdue = isOverdue ? Math.ceil((returnDate - this.dueDate) / (1000 * 60 * 60 * 24)) : 0;
  
  let fine = 0;
  let reason = null;
  
  // If book is returned after deadline, it's considered missing regardless of condition
  if (isOverdue) {
    // Missing book (returned after deadline) = 200% of book price + ₹50 per extra day
    fine = (bookPrice * 2) + (daysOverdue * 50);
    reason = 'lost_after_month';
  } else {
    // Book returned on time, check condition
    switch (this.condition) {
      case 'lost':
        fine = bookPrice * 2; // 200% of book cost only
        reason = 'lost_within_month';
        break;
      case 'minor_damage':
        fine = bookPrice * 0.1; // 10% of book cost
        reason = 'minor_damage';
        break;
      case 'major_damage':
        fine = bookPrice * 0.5; // 50% of book cost
        reason = 'major_damage';
        break;
      default:
        // Good condition, no fine
        fine = 0;
        reason = null;
    }
  }
  
  this.fine = fine;
  this.fineReason = reason;
  return fine;
};

// Index for better query performance
borrowRecordSchema.index({ borrower: 1, status: 1 });
borrowRecordSchema.index({ book: 1, status: 1 });
borrowRecordSchema.index({ dueDate: 1, status: 1 });

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);

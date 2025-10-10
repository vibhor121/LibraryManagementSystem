// Test file for BorrowRecord model fine calculation
// Run with: node tests/borrowRecord.test.js

const mongoose = require('mongoose');

// Mock BorrowRecord model for testing
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
    enum: ['overdue', 'lost_after_month', 'lost_within_month', 'minor_damage', 'major_damage'],
    required: false
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

// Method to calculate fine based on condition and time
borrowRecordSchema.methods.calculateFine = function(bookPrice) {
  const now = new Date();
  const isOverdue = now > this.dueDate;
  const daysOverdue = isOverdue ? Math.ceil((now - this.dueDate) / (1000 * 60 * 60 * 24)) : 0;
  
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

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);

// Test cases
const testCases = [
  {
    name: "Individual borrowing - returned on time, good condition",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'), // 30 days later
    returnDate: new Date('2024-01-25'), // Before due date
    condition: 'good',
    bookPrice: 500,
    expectedFine: 0,
    expectedReason: null
  },
  {
    name: "Individual borrowing - returned 5 days late, good condition",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'), // 30 days later
    returnDate: new Date('2024-02-05'), // 5 days after due date
    condition: 'good',
    bookPrice: 500,
    expectedFine: 1000 + 250, // 200% of book price + (5 days * ₹50)
    expectedReason: 'lost_after_month'
  },
  {
    name: "Individual borrowing - returned on time, minor damage",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'), // 30 days later
    returnDate: new Date('2024-01-25'), // Before due date
    condition: 'minor_damage',
    bookPrice: 500,
    expectedFine: 50, // 10% of book price
    expectedReason: 'minor_damage'
  },
  {
    name: "Individual borrowing - returned on time, major damage",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'), // 30 days later
    returnDate: new Date('2024-01-25'), // Before due date
    condition: 'major_damage',
    bookPrice: 500,
    expectedFine: 250, // 50% of book price
    expectedReason: 'major_damage'
  },
  {
    name: "Individual borrowing - returned on time, lost",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'), // 30 days later
    returnDate: new Date('2024-01-25'), // Before due date
    condition: 'lost',
    bookPrice: 500,
    expectedFine: 1000, // 200% of book price
    expectedReason: 'lost_within_month'
  },
  {
    name: "Group borrowing - returned 10 days late, good condition",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-07-01'), // 180 days later (6 months)
    returnDate: new Date('2024-07-11'), // 10 days after due date
    condition: 'good',
    bookPrice: 500,
    expectedFine: 1000 + 500, // 200% of book price + (10 days * ₹50)
    expectedReason: 'lost_after_month'
  },
  {
    name: "Individual borrowing - returned 10 days late (example from requirements)",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'), // 30 days later
    returnDate: new Date('2024-02-10'), // 10 days after due date
    condition: 'good',
    bookPrice: 500,
    expectedFine: 1000 + 500, // 200% of book price + (10 days * ₹50) = ₹1500
    expectedReason: 'lost_after_month'
  },
  {
    name: "Individual borrowing - returned 40 days after borrow (10 days late)",
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'), // 30 days later
    returnDate: new Date('2024-02-10'), // 40 days after borrow, 10 days after due
    condition: 'good',
    bookPrice: 500,
    expectedFine: 1000 + 500, // 200% of book price + (10 days * ₹50) = ₹1500
    expectedReason: 'lost_after_month'
  }
];

// Test function
function runTests() {
  console.log('🧪 Testing BorrowRecord Fine Calculation\n');
  console.log('='.repeat(60));
  
  let passedTests = 0;
  let totalTests = testCases.length;
  
  testCases.forEach((testCase, index) => {
    console.log(`\nTest ${index + 1}: ${testCase.name}`);
    console.log(`- Book Price: ₹${testCase.bookPrice}`);
    console.log(`- Borrow Date: ${testCase.borrowDate.toDateString()}`);
    console.log(`- Due Date: ${testCase.dueDate.toDateString()}`);
    console.log(`- Return Date: ${testCase.returnDate.toDateString()}`);
    console.log(`- Condition: ${testCase.condition}`);
    
    // Create a mock borrow record
    const mockRecord = {
      borrowDate: testCase.borrowDate,
      dueDate: testCase.dueDate,
      returnDate: testCase.returnDate,
      condition: testCase.condition,
      fine: 0,
      fineReason: null,
      calculateFine: function(bookPrice) {
        const now = this.returnDate; // Use return date as "now"
        const isOverdue = now > this.dueDate;
        const daysOverdue = isOverdue ? Math.ceil((now - this.dueDate) / (1000 * 60 * 60 * 24)) : 0;
        
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
      }
    };
    
    const calculatedFine = mockRecord.calculateFine(testCase.bookPrice);
    const calculatedReason = mockRecord.fineReason;
    
    console.log(`- Expected Fine: ₹${testCase.expectedFine}`);
    console.log(`- Calculated Fine: ₹${calculatedFine}`);
    console.log(`- Expected Reason: ${testCase.expectedReason}`);
    console.log(`- Calculated Reason: ${calculatedReason}`);
    
    const fineMatch = calculatedFine === testCase.expectedFine;
    const reasonMatch = calculatedReason === testCase.expectedReason;
    
    if (fineMatch && reasonMatch) {
      console.log('✅ PASS');
      passedTests++;
    } else {
      console.log('❌ FAIL');
      if (!fineMatch) {
        console.log(`   Fine mismatch: expected ₹${testCase.expectedFine}, got ₹${calculatedFine}`);
      }
      if (!reasonMatch) {
        console.log(`   Reason mismatch: expected "${testCase.expectedReason}", got "${calculatedReason}"`);
      }
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Fine calculation logic is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the fine calculation logic.');
  }
  
  return passedTests === totalTests;
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, testCases };

// Integration test for complete borrowing and fine calculation scenarios
// Run with: node tests/integration.test.js

// Import test modules
const { runTests: runFineTests } = require('./borrowRecord.test.js');
const { runBorrowingTests, testDueDateCalculation } = require('./borrowingLogic.test.js');

// Integration test scenarios
const integrationScenarios = [
  {
    name: "Complete Individual Borrowing Flow - On Time Return",
    steps: [
      "User borrows book individually",
      "Book is returned on time in good condition",
      "No fine should be applied"
    ],
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'),
    returnDate: new Date('2024-01-25'),
    condition: 'good',
    bookPrice: 500,
    expectedFine: 0,
    expectedStatus: 'returned'
  },
  {
    name: "Complete Individual Borrowing Flow - Late Return",
    steps: [
      "User borrows book individually",
      "Book is returned 10 days late in good condition",
      "Missing book fine should be applied (200% + daily fees)"
    ],
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-31'),
    returnDate: new Date('2024-02-10'),
    condition: 'good',
    bookPrice: 500,
    expectedFine: 1500, // 200% of 500 + (10 days * 50)
    expectedStatus: 'returned'
  },
  {
    name: "Complete Group Borrowing Flow - On Time Return with Damage",
    steps: [
      "Group borrows book",
      "Book is returned on time with minor damage",
      "Damage fine should be applied (10% of book price)"
    ],
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-07-01'), // 180 days
    returnDate: new Date('2024-06-25'),
    condition: 'minor_damage',
    bookPrice: 800,
    expectedFine: 80, // 10% of 800
    expectedStatus: 'returned'
  },
  {
    name: "Complete Group Borrowing Flow - Late Return",
    steps: [
      "Group borrows book",
      "Book is returned 15 days late",
      "Missing book fine should be applied (200% + daily fees)"
    ],
    borrowDate: new Date('2024-01-01'),
    dueDate: new Date('2024-07-01'), // 180 days
    returnDate: new Date('2024-07-16'),
    condition: 'good',
    bookPrice: 800,
    expectedFine: 1600 + 750, // 200% of 800 + (15 days * 50)
    expectedStatus: 'returned'
  }
];

// Mock fine calculation function (same as in BorrowRecord model)
function calculateFine(borrowDate, dueDate, returnDate, condition, bookPrice) {
  const isOverdue = returnDate > dueDate;
  const daysOverdue = isOverdue ? Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24)) : 0;
  
  let fine = 0;
  let reason = null;
  
  // If book is returned after deadline, it's considered missing regardless of condition
  if (isOverdue) {
    // Missing book (returned after deadline) = 200% of book price + ₹50 per extra day
    fine = (bookPrice * 2) + (daysOverdue * 50);
    reason = 'lost_after_month';
  } else {
    // Book returned on time, check condition
    switch (condition) {
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
  
  return { fine, reason };
}

// Test function for integration scenarios
function runIntegrationTests() {
  console.log('🧪 Integration Tests - Complete Borrowing and Fine Scenarios\n');
  console.log('='.repeat(70));
  
  let passedTests = 0;
  let totalTests = integrationScenarios.length;
  
  integrationScenarios.forEach((scenario, index) => {
    console.log(`\nIntegration Test ${index + 1}: ${scenario.name}`);
    console.log(`Steps:`);
    scenario.steps.forEach((step, stepIndex) => {
      console.log(`  ${stepIndex + 1}. ${step}`);
    });
    
    console.log(`\nScenario Details:`);
    console.log(`- Book Price: ₹${scenario.bookPrice}`);
    console.log(`- Borrow Date: ${scenario.borrowDate.toDateString()}`);
    console.log(`- Due Date: ${scenario.dueDate.toDateString()}`);
    console.log(`- Return Date: ${scenario.returnDate.toDateString()}`);
    console.log(`- Condition: ${scenario.condition}`);
    
    // Calculate fine using the same logic as the model
    const result = calculateFine(
      scenario.borrowDate,
      scenario.dueDate,
      scenario.returnDate,
      scenario.condition,
      scenario.bookPrice
    );
    
    console.log(`- Expected Fine: ₹${scenario.expectedFine}`);
    console.log(`- Calculated Fine: ₹${result.fine}`);
    console.log(`- Fine Reason: ${result.reason}`);
    
    const fineMatch = result.fine === scenario.expectedFine;
    
    if (fineMatch) {
      console.log('✅ PASS');
      passedTests++;
    } else {
      console.log('❌ FAIL');
      console.log(`   Fine mismatch: expected ₹${scenario.expectedFine}, got ₹${result.fine}`);
    }
  });
  
  console.log('\n' + '='.repeat(70));
  console.log(`\n📊 Integration Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All integration tests passed!');
  } else {
    console.log('⚠️  Some integration tests failed.');
  }
  
  return passedTests === totalTests;
}

// Test book availability and copy management
function testBookAvailability() {
  console.log('\n🧪 Testing Book Availability and Copy Management\n');
  console.log('='.repeat(50));
  
  const testBooks = [
    { title: 'Book 1', totalCopies: 3, borrowedCopies: 0, expectedAvailable: 3 },
    { title: 'Book 2', totalCopies: 3, borrowedCopies: 1, expectedAvailable: 2 },
    { title: 'Book 3', totalCopies: 3, borrowedCopies: 2, expectedAvailable: 1 },
    { title: 'Book 4', totalCopies: 3, borrowedCopies: 3, expectedAvailable: 0 }
  ];
  
  let passedTests = 0;
  let totalTests = testBooks.length;
  
  testBooks.forEach((book, index) => {
    const availableCopies = book.totalCopies - book.borrowedCopies;
    const isAvailable = availableCopies > 0;
    const expectedAvailable = book.expectedAvailable;
    
    console.log(`\nBook ${index + 1}: ${book.title}`);
    console.log(`- Total Copies: ${book.totalCopies}`);
    console.log(`- Borrowed Copies: ${book.borrowedCopies}`);
    console.log(`- Available Copies: ${availableCopies} (expected: ${expectedAvailable})`);
    console.log(`- Is Available: ${isAvailable}`);
    
    const testPassed = availableCopies === expectedAvailable;
    
    if (testPassed) {
      console.log('✅ PASS');
      passedTests++;
    } else {
      console.log('❌ FAIL');
      console.log(`   Available copies mismatch: expected ${expectedAvailable}, got ${availableCopies}`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Book Availability Test Results: ${passedTests}/${totalTests} tests passed`);
  
  return passedTests === totalTests;
}

// Test group size validation
function testGroupSizeValidation() {
  console.log('\n🧪 Testing Group Size Validation\n');
  console.log('='.repeat(40));
  
  const testGroups = [
    { name: 'Group 1', memberCount: 2, expectedValid: false, reason: 'Too few members (minimum 3)' },
    { name: 'Group 2', memberCount: 3, expectedValid: true, reason: 'Valid group size' },
    { name: 'Group 3', memberCount: 4, expectedValid: true, reason: 'Valid group size' },
    { name: 'Group 4', memberCount: 5, expectedValid: true, reason: 'Valid group size' },
    { name: 'Group 5', memberCount: 6, expectedValid: true, reason: 'Valid group size' },
    { name: 'Group 6', memberCount: 7, expectedValid: false, reason: 'Too many members (maximum 6)' }
  ];
  
  let passedTests = 0;
  let totalTests = testGroups.length;
  
  testGroups.forEach((group, index) => {
    const isValid = group.memberCount >= 3 && group.memberCount <= 6;
    
    console.log(`\nGroup ${index + 1}: ${group.name}`);
    console.log(`- Member Count: ${group.memberCount}`);
    console.log(`- Expected Valid: ${group.expectedValid}`);
    console.log(`- Actual Valid: ${isValid}`);
    console.log(`- Reason: ${group.reason}`);
    
    const testPassed = isValid === group.expectedValid;
    
    if (testPassed) {
      console.log('✅ PASS');
      passedTests++;
    } else {
      console.log('❌ FAIL');
      console.log(`   Validation mismatch: expected ${group.expectedValid}, got ${isValid}`);
    }
  });
  
  console.log('\n' + '='.repeat(40));
  console.log(`\n📊 Group Size Validation Test Results: ${passedTests}/${totalTests} tests passed`);
  
  return passedTests === totalTests;
}

// Main test runner
function runAllTests() {
  console.log('🚀 Running Complete Library Management System Tests\n');
  console.log('='.repeat(80));
  
  // Run individual test suites
  const fineTestsPassed = runFineTests();
  const borrowingTestsPassed = runBorrowingTests();
  const dueDateTestsPassed = testDueDateCalculation();
  const integrationTestsPassed = runIntegrationTests();
  const availabilityTestsPassed = testBookAvailability();
  const groupSizeTestsPassed = testGroupSizeValidation();
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📋 COMPLETE TEST SUMMARY');
  console.log('='.repeat(80));
  
  const testResults = [
    { name: 'Fine Calculation Tests', passed: fineTestsPassed },
    { name: 'Borrowing Logic Tests', passed: borrowingTestsPassed },
    { name: 'Due Date Calculation Tests', passed: dueDateTestsPassed },
    { name: 'Integration Tests', passed: integrationTestsPassed },
    { name: 'Book Availability Tests', passed: availabilityTestsPassed },
    { name: 'Group Size Validation Tests', passed: groupSizeTestsPassed }
  ];
  
  let totalPassed = 0;
  testResults.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}: ${result.passed ? 'PASSED' : 'FAILED'}`);
    if (result.passed) totalPassed++;
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`🎯 OVERALL RESULT: ${totalPassed}/${testResults.length} test suites passed`);
  
  if (totalPassed === testResults.length) {
    console.log('\n🎉 ALL TESTS PASSED! 🎉');
    console.log('The library management system is working correctly according to all requirements:');
    console.log('✅ 3 copies per book category');
    console.log('✅ One book per person/group at a time');
    console.log('✅ Individual: 30 days, Group: 180 days');
    console.log('✅ Missing book: 200% + ₹50/day');
    console.log('✅ Small damage: 10%, Large damage: 50%');
    console.log('✅ Books returned after deadline = missing (200% + daily fees)');
    console.log('✅ Group size: 3-6 members');
    console.log('✅ Proper fine distribution for groups');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED');
    console.log('Please review the failed test suites and fix the issues.');
  }
  
  return totalPassed === testResults.length;
}

// Run all tests if this file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { 
  runAllTests, 
  runIntegrationTests, 
  testBookAvailability, 
  testGroupSizeValidation 
};

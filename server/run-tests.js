#!/usr/bin/env node

// Test runner script for Library Management System
// Run with: node run-tests.js

const { runAllTests } = require('./tests/integration.test.js');

console.log('🧪 Library Management System - Test Suite');
console.log('==========================================\n');

// Run all tests
const allTestsPassed = runAllTests();

// Exit with appropriate code
process.exit(allTestsPassed ? 0 : 1);

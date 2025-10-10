const BorrowRecord = require('../models/BorrowRecord');
const User = require('../models/User');
const Book = require('../models/Book');
const Group = require('../models/Group');
const { sendOverdueNotification, sendFineNotification } = require('./emailService');

// Check for overdue books and send notifications
const checkOverdueBooks = async () => {
  try {
    console.log('Starting overdue book check...');
    
    // Find all borrowed books that are overdue
    const overdueRecords = await BorrowRecord.find({
      status: 'borrowed',
      dueDate: { $lt: new Date() }
    }).populate('borrower book');

    console.log(`Found ${overdueRecords.length} overdue books`);

    for (const record of overdueRecords) {
      try {
        // Update status to overdue
        record.status = 'overdue';
        await record.save();

        // Calculate fine
        const fine = record.calculateFine(record.book.price);
        await record.save();

        // Update user's total fines
        await User.findByIdAndUpdate(record.borrower._id, {
          $inc: { totalFines: fine }
        });

        // Send email notification
        await sendOverdueNotification(record.borrower, record, record.book);
        
        console.log(`Processed overdue book: ${record.book.title} for user: ${record.borrower.email}`);
      } catch (error) {
        console.error(`Error processing overdue record ${record._id}:`, error);
      }
    }

    console.log('Overdue book check completed');
  } catch (error) {
    console.error('Error in checkOverdueBooks:', error);
  }
};

// Check for books that have been overdue and apply missing book fines
const checkLostBooks = async () => {
  try {
    console.log('Starting lost book check...');
    
    // Find all overdue books (any book past due date is considered missing)
    const overdueRecords = await BorrowRecord.find({
      status: { $in: ['borrowed', 'overdue'] },
      dueDate: { $lt: new Date() }
    }).populate('borrower book group');

    console.log(`Found ${overdueRecords.length} overdue books`);

    for (const record of overdueRecords) {
      try {
        // Mark as overdue if not already
        if (record.status === 'borrowed') {
          record.status = 'overdue';
        }
        
        // Calculate fine for missing book (200% + daily late fees)
        const fine = record.calculateFine(record.book.price);
        await record.save();

        // Update user/group fines
        if (record.group) {
          // Group borrowing - distribute fine equally
          const finePerMember = fine / record.group.members.length;
          
          // Update each member's total fines
          for (const member of record.group.members) {
            await User.findByIdAndUpdate(member._id, {
              $inc: { totalFines: finePerMember }
            });
          }
          
          // Update group's total fines
          await Group.findByIdAndUpdate(record.group._id, {
            $inc: { totalFines: fine }
          });
        } else {
          // Individual borrowing
          await User.findByIdAndUpdate(record.borrower._id, {
            $inc: { totalFines: fine }
          });
        }

        // Send email notification
        await sendFineNotification(record.borrower, record, record.book, fine, record.fineReason);
        
        console.log(`Applied missing book fine: ${record.book.title} for user: ${record.borrower.email}, fine: ₹${fine}`);
      } catch (error) {
        console.error(`Error processing overdue record ${record._id}:`, error);
      }
    }

    console.log('Lost book check completed');
  } catch (error) {
    console.error('Error in checkLostBooks:', error);
  }
};

// Daily cleanup and maintenance
const dailyMaintenance = async () => {
  try {
    console.log('Starting daily maintenance...');
    
    // Check overdue books
    await checkOverdueBooks();
    
    // Check for lost books
    await checkLostBooks();
    
    // Update book availability counts
    await updateBookAvailability();
    
    console.log('Daily maintenance completed');
  } catch (error) {
    console.error('Error in daily maintenance:', error);
  }
};

// Update book availability counts
const updateBookAvailability = async () => {
  try {
    const books = await Book.find({ isActive: true });
    
    for (const book of books) {
      const borrowedCount = await BorrowRecord.countDocuments({
        book: book._id,
        status: { $in: ['borrowed', 'overdue'] }
      });
      
      book.borrowedCopies = borrowedCount;
      book.availableCopies = book.totalCopies - borrowedCount;
      await book.save();
    }
    
    console.log('Book availability updated');
  } catch (error) {
    console.error('Error updating book availability:', error);
  }
};

module.exports = {
  checkOverdueBooks,
  checkLostBooks,
  dailyMaintenance,
  updateBookAvailability
};

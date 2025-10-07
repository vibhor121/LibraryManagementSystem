const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send overdue notification
const sendOverdueNotification = async (user, borrowRecord, book) => {
  try {
    const transporter = createTransporter();
    
    const daysOverdue = Math.ceil((new Date() - borrowRecord.dueDate) / (1000 * 60 * 60 * 24));
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Book Overdue Notice - Library Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Book Overdue Notice</h2>
          <p>Dear ${user.name},</p>
          
          <p>This is to inform you that the following book is overdue:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Due Date:</strong> ${borrowRecord.dueDate.toLocaleDateString()}</p>
            <p><strong>Days Overdue:</strong> ${daysOverdue} days</p>
          </div>
          
          <p><strong>Fine Amount:</strong> ₹50 (for overdue books)</p>
          
          <p>Please return the book as soon as possible to avoid additional fines.</p>
          
          <p>If you have any questions, please contact the library staff.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Library Management System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Overdue notification sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending overdue notification:', error);
  }
};

// Send fine notification
const sendFineNotification = async (user, borrowRecord, book, fineAmount, reason) => {
  try {
    const transporter = createTransporter();
    
    let fineReasonText = '';
    switch (reason) {
      case 'overdue':
        fineReasonText = 'Book returned after due date';
        break;
      case 'lost_after_month':
        fineReasonText = 'Book lost after due date';
        break;
      case 'lost_within_month':
        fineReasonText = 'Book lost within borrowing period';
        break;
      case 'minor_damage':
        fineReasonText = 'Book returned with minor damage';
        break;
      case 'major_damage':
        fineReasonText = 'Book returned with major damage';
        break;
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Fine Notice - Library Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Fine Notice</h2>
          <p>Dear ${user.name},</p>
          
          <p>A fine has been imposed for the following book:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Borrow Date:</strong> ${borrowRecord.borrowDate.toLocaleDateString()}</p>
            <p><strong>Due Date:</strong> ${borrowRecord.dueDate.toLocaleDateString()}</p>
            <p><strong>Return Date:</strong> ${borrowRecord.returnDate ? borrowRecord.returnDate.toLocaleDateString() : 'Not returned'}</p>
          </div>
          
          <div style="background-color: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Fine Reason:</strong> ${fineReasonText}</p>
            <p><strong>Fine Amount:</strong> ₹${fineAmount}</p>
          </div>
          
          <p>Please pay the fine at the library counter to clear your account.</p>
          
          <p>If you have any questions about this fine, please contact the library staff.</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Library Management System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Fine notification sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending fine notification:', error);
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to Library Management System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1976d2;">Welcome to Library Management System!</h2>
          <p>Dear ${user.name},</p>
          
          <p>Your account has been successfully created. You can now:</p>
          
          <ul>
            <li>Browse and search books in our catalog</li>
            <li>Borrow books individually or as part of a group</li>
            <li>Submit feedback about books and library services</li>
            <li>Track your borrowing history and fines</li>
          </ul>
          
          <p><strong>Important Reminders:</strong></p>
          <ul>
            <li>Books can be borrowed for 1 month</li>
            <li>Each book has 3 copies available</li>
            <li>Groups can have 3-6 members</li>
            <li>Fines apply for overdue, lost, or damaged books</li>
          </ul>
          
          <p>If you have any questions, please don't hesitate to contact us.</p>
          
          <p>Happy reading!</p>
          
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from the Library Management System.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

module.exports = {
  sendOverdueNotification,
  sendFineNotification,
  sendWelcomeEmail
};

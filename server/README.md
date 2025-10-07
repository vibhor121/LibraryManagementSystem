# Library Management System

A comprehensive library management system built with Node.js, Express.js, MongoDB, and React.js. This system supports individual and group borrowing, fine calculation, feedback management, and admin dashboard.

## Features

### Core Functionality
- **User Authentication**: JWT-based authentication with role-based access control
- **Book Management**: CRUD operations for books with availability tracking
- **Individual Borrowing**: Users can borrow books individually
- **Group Borrowing**: Users can form groups (3-6 members) to borrow books together
- **Fine Calculation**: Automated fine calculation based on various conditions
- **Feedback System**: Users can submit feedback about books and library services
- **Admin Dashboard**: Comprehensive admin panel for managing the system

### Book Management
- Each book has 3 copies available
- Real-time availability tracking
- Book search and filtering
- Genre-based categorization
- ISBN validation

### Borrowing System
- 1-month borrowing duration
- Individual and group borrowing support
- Automatic due date calculation
- Overdue book tracking
- Return condition tracking (good, minor damage, major damage, lost)

### Fine System
- **Overdue**: ₹50 fine for books returned after due date
- **Lost after 1 month**: 200% of book cost + ₹50 fine
- **Lost within 1 month**: 200% of book cost only
- **Minor damage**: 10% of book cost
- **Major damage**: 50% of book cost
- **Group fines**: Distributed equally among all group members

### Group Management
- Groups can have 3-6 members
- Group leader can manage members
- Leadership transfer functionality
- Group disbanding with proper checks

### Feedback System
- Book-specific feedback
- General library feedback
- Service feedback
- Rating system (1-5 stars)
- Admin response capability
- Public/private feedback options

### Admin Features
- User management
- Book management
- Borrow record tracking
- Fine management
- Feedback moderation
- Dashboard analytics
- System statistics

## Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcryptjs**: Password hashing
- **Express-validator**: Input validation
- **Nodemailer**: Email notifications
- **Node-cron**: Scheduled tasks

### Frontend (To be implemented)
- **React.js**: Frontend framework
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **React Router**: Navigation
- **Formik + Yup**: Form handling and validation

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd libraryManagementSystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   
   # Email configuration for notifications
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Admin credentials
   ADMIN_EMAIL=admin@library.com
   ADMIN_PASSWORD=admin123
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Books
- `GET /api/books` - Get all books (with search and filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)
- `GET /api/books/stats/overview` - Get book statistics (Admin only)

### Borrowing
- `POST /api/borrow/individual` - Borrow book individually
- `POST /api/borrow/group` - Borrow book for group
- `PUT /api/borrow/return/:id` - Return book
- `GET /api/borrow/history` - Get borrow history
- `GET /api/borrow/current` - Get current borrowings
- `PUT /api/borrow/pay-fine/:id` - Pay fine

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups/my-group` - Get user's group
- `PUT /api/groups/:id/add-member` - Add member to group
- `PUT /api/groups/:id/remove-member` - Remove member from group
- `PUT /api/groups/:id/transfer-leadership` - Transfer group leadership
- `PUT /api/groups/:id/leave` - Leave group
- `DELETE /api/groups/:id` - Disband group

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all public feedback
- `GET /api/feedback/my-feedback` - Get user's feedback
- `GET /api/feedback/:id` - Get single feedback
- `PUT /api/feedback/:id` - Update feedback
- `DELETE /api/feedback/:id` - Delete feedback
- `GET /api/feedback/stats/overview` - Get feedback statistics (Admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/borrow-records` - Get all borrow records
- `GET /api/admin/groups` - Get all groups
- `GET /api/admin/feedback` - Get all feedback
- `PUT /api/admin/feedback/:id/status` - Update feedback status
- `PUT /api/admin/users/:id/status` - Update user status
- `POST /api/admin/create-admin` - Create admin user

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/stats` - Get user statistics
- `GET /api/users/:id/current-borrows` - Get user's current borrowings
- `GET /api/users/:id/borrow-history` - Get user's borrow history
- `GET /api/users/:id/fines` - Get user's fine details
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Database Schema

### Collections
- **users**: User information and authentication
- **books**: Book catalog and availability
- **borrowRecords**: Borrowing history and fine tracking
- **groups**: Group information and member management
- **feedback**: User feedback and ratings

## Automated Features

### Cron Jobs
- **Daily Overdue Check**: Runs daily at 9 AM to check for overdue books
- **Fine Calculation**: Automatically calculates fines based on return conditions
- **Email Notifications**: Sends overdue and fine notifications
- **Book Availability Update**: Updates book availability counts

### Email Notifications
- Welcome emails for new users
- Overdue book notifications
- Fine notifications with detailed breakdown
- Admin notifications for system events

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Development

### Project Structure
```
libraryManagementSystem/
├── models/           # Database models
├── routes/           # API routes
├── middleware/       # Custom middleware
├── utils/            # Utility functions
├── server.js         # Main server file
├── package.json      # Dependencies
└── README.md         # Documentation
```

### Adding New Features
1. Create/update models in `models/` directory
2. Add routes in `routes/` directory
3. Update middleware if needed
4. Add utility functions in `utils/` directory
5. Update server.js to include new routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

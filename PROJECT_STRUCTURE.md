# Library Management System - Project Structure

## 📁 Directory Structure

```
libraryManagementSystem/
├── 📁 server/                    # Backend API (Node.js + Express + MongoDB)
│   ├── 📁 models/               # MongoDB Models
│   │   ├── Book.js              # Book model with availability tracking
│   │   ├── BorrowRecord.js      # Borrowing records and fine tracking
│   │   ├── Feedback.js          # User feedback and ratings
│   │   ├── Group.js             # Group management model
│   │   └── User.js              # User authentication model
│   ├── 📁 routes/               # API Routes
│   │   ├── admin.js             # Admin management routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── books.js             # Book CRUD operations
│   │   ├── borrow.js            # Borrowing and returning logic
│   │   ├── feedback.js          # Feedback submission and management
│   │   ├── groups.js            # Group management routes
│   │   └── users.js             # User management routes
│   ├── 📁 middleware/           # Custom Middleware
│   │   └── auth.js              # JWT authentication middleware
│   ├── 📁 utils/                # Utility Functions
│   │   ├── cronJobs.js          # Scheduled tasks for overdue books
│   │   ├── emailService.js      # Email notification service
│   │   └── generateToken.js     # JWT token generation
│   ├── server.js                # Main server file
│   ├── package.json             # Server dependencies
│   └── env.example              # Server environment variables template
├── 📁 client/                   # Frontend (React + Create React App)
│   ├── 📁 public/               # Static Files
│   │   ├── index.html           # Main HTML template
│   │   ├── manifest.json        # PWA manifest
│   │   └── robots.txt           # SEO robots file
│   ├── 📁 src/                  # React Source Code
│   │   ├── 📁 components/       # Reusable Components
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Navbar.jsx
│   │   ├── 📁 pages/            # Page Components
│   │   │   ├── 📁 admin/        # Admin Pages
│   │   │   │   ├── AdminBooks.jsx
│   │   │   │   ├── AdminBorrows.jsx
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AdminFeedback.jsx
│   │   │   │   └── AdminUsers.jsx
│   │   │   ├── BookDetail.jsx
│   │   │   ├── Books.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── Groups.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MyBooks.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── 📁 services/         # API Services
│   │   │   ├── adminService.js
│   │   │   ├── api.js           # Axios configuration
│   │   │   ├── authService.js
│   │   │   ├── bookService.js
│   │   │   ├── borrowService.js
│   │   │   ├── feedbackService.js
│   │   │   └── groupService.js
│   │   ├── 📁 contexts/         # React Contexts
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── 📁 hooks/            # Custom Hooks
│   │   │   └── useAuth.js       # Authentication hook
│   │   ├── App.jsx              # Main App component
│   │   ├── index.js             # React entry point
│   │   └── index.css            # Global styles
│   ├── package.json             # Client dependencies
│   └── env.example              # Client environment variables template
├── README.md                    # Main documentation
├── SETUP.md                     # Detailed setup guide
└── PROJECT_STRUCTURE.md         # This file
```

## 🚀 Quick Start Commands

### Server Setup and Run

```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Start server in development mode
npm run dev

# Start server in production mode
npm start
```

### Client Setup and Run

```bash
# Navigate to client directory
cd client

# Install client dependencies
npm install

# Start client development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Running Both Together

```bash
# Terminal 1: Start server
cd server && npm run dev

# Terminal 2: Start client
cd client && npm start
```

## 🔧 Environment Configuration

### Server Environment (`server/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Admin credentials
ADMIN_EMAIL=admin@library.com
ADMIN_PASSWORD=admin123
```

### Client Environment (`client/.env`)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

### Server Dependencies
- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables
- **express-validator**: Input validation
- **nodemailer**: Email notifications
- **node-cron**: Scheduled tasks
- **multer**: File upload handling

### Client Dependencies
- **react**: Frontend framework
- **react-dom**: React DOM rendering
- **react-router-dom**: Client-side routing
- **axios**: HTTP client
- **formik**: Form handling
- **yup**: Form validation
- **@heroicons/react**: Icon library
- **react-hot-toast**: Toast notifications
- **date-fns**: Date manipulation
- **react-scripts**: Create React App scripts

### Root Dependencies
- **concurrently**: Run multiple commands simultaneously

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Books
- `GET /api/books` - Get all books (with search and filters)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Borrowing
- `POST /api/borrow/individual` - Borrow book individually
- `POST /api/borrow/group` - Borrow book for group
- `PUT /api/borrow/return/:id` - Return book
- `GET /api/borrow/history` - Get borrow history
- `GET /api/borrow/current` - Get current borrowings

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups/my-group` - Get user's group
- `PUT /api/groups/:id/add-member` - Add member to group
- `PUT /api/groups/:id/remove-member` - Remove member from group

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all public feedback
- `GET /api/feedback/my-feedback` - Get user's feedback

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/borrow-records` - Get all borrow records
- `PUT /api/admin/feedback/:id/status` - Update feedback status

## 🗄️ Database Schema

### Collections
- **users**: User information and authentication
- **books**: Book catalog and availability
- **borrowRecords**: Borrowing history and fine tracking
- **groups**: Group information and member management
- **feedback**: User feedback and ratings

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📧 Email Notifications

- Welcome emails for new users
- Overdue book notifications
- Fine notifications with detailed breakdown
- Admin notifications for system events

## 🚀 Deployment

### Development
```bash
# Start both client and server
npm run dev
```

### Production
```bash
# Build client
npm run build-client

# Start server
npm run start-server
```

### Docker (Optional)
```bash
# Build and run with Docker
docker-compose up --build
```

## 🧪 Testing

### Manual Testing
- User registration and login
- Book browsing and search
- Individual and group borrowing
- Book return with different conditions
- Fine calculation and payment
- Feedback submission
- Admin dashboard functionality

### Automated Testing
```bash
# Run client tests
cd client && npm test

# Run server tests (if implemented)
cd server && npm test
```

## 📝 Development Notes

### Code Organization
- **Server**: Follows MVC pattern with separate models, routes, and middleware
- **Client**: Component-based architecture with custom hooks and contexts
- **API**: RESTful design with proper HTTP status codes
- **Database**: MongoDB with Mongoose ODM for schema validation

### Best Practices
- Environment variables for configuration
- Input validation on both client and server
- Error handling with proper HTTP status codes
- Responsive design for mobile compatibility
- Security headers and CORS configuration
- Code splitting and lazy loading

### Performance Optimizations
- Database indexing for faster queries
- Pagination for large datasets
- Image optimization and lazy loading
- Caching strategies for frequently accessed data
- Bundle optimization for faster loading

---

**Happy Coding! 🎉**

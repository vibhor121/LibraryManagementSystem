# Library Management System

A comprehensive library management system built with Node.js, Express.js, MongoDB, and React.js. This system supports individual and group borrowing, fine calculation, feedback management, and admin dashboard.

## 🏗️ Project Structure

```
libraryManagementSystem/
├── server/                 # Backend API (Node.js + Express + MongoDB)
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Main server file
│   ├── package.json       # Server dependencies
│   └── env.example        # Server environment variables
├── client/                # Frontend (React + Create React App)
│   ├── public/            # Static files
│   ├── src/               # React source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── contexts/      # React contexts
│   │   └── hooks/         # Custom hooks
│   ├── package.json       # Client dependencies
│   └── env.example        # Client environment variables
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Install Dependencies

#### Server Dependencies
```bash
cd server
npm install
```

#### Client Dependencies
```bash
cd client
npm install
```

### 2. Environment Setup

#### Server Environment
```bash
# Copy server environment file
cp server/env.example server/.env

# Edit server/.env with your configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
# For local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/library_management

# For MongoDB Atlas (recommended):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/library_management?retryWrites=true&w=majority

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

> **📚 Need help setting up MongoDB Atlas?** Check out our detailed [MongoDB Atlas Setup Guide](MONGODB_ATLAS_SETUP.md)

#### Client Environment
```bash
# Copy client environment file
cp client/env.example client/.env

# Edit client/.env with your configuration
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Application

#### Start Server (Terminal 1)
```bash
cd server
npm run dev
```

#### Start Client (Terminal 2)
```bash
cd client
npm start
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 🔐 Demo Admin Credentials

For testing purposes, you can use the following demo admin credentials:

**Email:** `admin@library.com`  
**Password:** `admin123`

> **⚠️ Important:** These are demo credentials for development/testing only. Make sure to create your own admin account and change these credentials in production environments.

### Creating Admin Account

If the demo admin account doesn't exist, you can create it using the API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@library.com",
    "password": "admin123",
    "role": "admin"
  }'
```

## 📋 Available Scripts

### Server Scripts (from server/ directory)
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

### Client Scripts (from client/ directory)
- `npm start` - Start the client development server
- `npm run build` - Build the client for production
- `npm test` - Run client tests
- `npm run eject` - Eject from Create React App (not recommended)

## 🎯 Features

### ✅ Core Features
- [x] User Authentication (JWT-based)
- [x] Book Management (CRUD operations)
- [x] Individual Book Borrowing
- [x] Group Book Borrowing (3-6 members)
- [x] Fine Calculation System
- [x] Feedback System
- [x] Admin Dashboard
- [x] Email Notifications

### ✅ Book Management
- [x] Each book has 3 copies available
- [x] Real-time availability tracking
- [x] Book search and filtering
- [x] Genre-based categorization
- [x] ISBN validation

### ✅ Borrowing System
- [x] 1-month borrowing duration
- [x] Individual and group borrowing support
- [x] Automatic due date calculation
- [x] Overdue book tracking
- [x] Return condition tracking

### ✅ Fine System
- [x] ₹50 fine for overdue books
- [x] 200% of book cost + ₹50 for lost books after 1 month
- [x] 200% of book cost for lost books within 1 month
- [x] 10% fine for minor damage
- [x] 50% fine for major damage
- [x] Group fines distributed equally among members

### ✅ Group Management
- [x] Groups can have 3-6 members
- [x] Group leader management
- [x] Leadership transfer
- [x] Group disbanding with proper checks

### ✅ Admin Features
- [x] User management
- [x] Book management
- [x] Borrow record tracking
- [x] Fine management
- [x] Feedback moderation
- [x] Dashboard analytics

### ✅ Automated Features
- [x] Daily overdue book checks (cron jobs)
- [x] Email notifications for fines and overdue books
- [x] Automatic fine calculation
- [x] Book availability updates

## 🗄️ Database Schema

### Collections
- **users**: User information and authentication
- **books**: Book catalog and availability
- **borrowRecords**: Borrowing history and fine tracking
- **groups**: Group information and member management
- **feedback**: User feedback and ratings

## 🔧 API Endpoints

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

## 🎨 Frontend Features

### ✅ User Interface
- [x] Responsive design with CSS
- [x] Modern React components
- [x] Form validation with Formik + Yup
- [x] Toast notifications
- [x] Loading states and error handling

### ✅ Pages Implemented
- [x] Login/Register pages
- [x] Dashboard with statistics
- [x] Book catalog with search
- [x] Book detail page
- [x] My Books (borrowing history)
- [x] Groups management
- [x] Feedback system
- [x] User profile
- [x] Admin dashboard
- [x] Admin book management
- [x] Admin user management
- [x] Admin borrow records
- [x] Admin feedback management

## 🔐 Security Features

- [x] JWT-based authentication
- [x] Password hashing with bcrypt
- [x] Role-based access control
- [x] Input validation and sanitization
- [x] CORS configuration
- [x] Environment variable protection

## 📧 Email Notifications

- [x] Welcome emails for new users
- [x] Overdue book notifications
- [x] Fine notifications with detailed breakdown
- [x] Admin notifications for system events

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB database (local or cloud)
2. Configure environment variables in `server/.env`
3. Deploy the `server/` directory to your preferred platform
4. Ensure MongoDB connection is accessible

### Frontend Deployment
1. Build the React app: `npm run build-client`
2. Deploy the `client/build` folder to your hosting platform
3. Update API URL in `client/.env` for production

### Full Stack Deployment
1. Deploy server to your backend platform
2. Deploy client to your frontend platform
3. Update client environment variables to point to production API

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Book browsing and search
- [ ] Individual book borrowing
- [ ] Group creation and management
- [ ] Group book borrowing
- [ ] Book return with different conditions
- [ ] Fine calculation and payment
- [ ] Feedback submission
- [ ] Admin dashboard functionality
- [ ] Email notifications

## 📝 Default Admin Account

After setting up the system, you can create an admin account using the API:

```bash
curl -X POST http://localhost:5000/api/admin/create-admin \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Admin User",
    "email": "admin@library.com",
    "password": "admin123",
    "phone": "1234567890",
    "address": "Admin Address"
  }'
```

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `server/.env`
   - Verify network access if using cloud MongoDB

2. **Email Notifications Not Working**
   - Check email configuration in `server/.env`
   - Verify SMTP credentials
   - Test with a simple email service first

3. **Frontend Not Connecting to Backend**
   - Verify `REACT_APP_API_URL` in `client/.env`
   - Check if backend server is running
   - Ensure CORS is properly configured

4. **Authentication Issues**
   - Check `JWT_SECRET` in `server/.env`
   - Verify token expiration settings
   - Clear browser localStorage if needed

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://reactjs.org/)
- [Create React App Documentation](https://create-react-app.dev/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🎉**

For any issues or questions, please check the troubleshooting section or create an issue in the repository.
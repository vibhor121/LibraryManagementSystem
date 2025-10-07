# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

#### Server
```bash
cd server
npm install
```

#### Client
```bash
cd client
npm install
```

### 2. Set Up Environment Variables

#### Server
```bash
cp server/env.example server/.env
# Edit server/.env with your MongoDB connection and other settings
```

#### Client
```bash
cp client/env.example client/.env
# Edit client/.env if you need to change the API URL
```

### 3. Start the Application

#### Terminal 1 - Start Server
```bash
cd server
npm run dev
```

#### Terminal 2 - Start Client
```bash
cd client
npm start
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📋 What's Next?

1. **Set up MongoDB**: Make sure MongoDB is running locally or configure cloud MongoDB in `server/.env`
2. **Configure Email**: Set up email credentials in `server/.env` for notifications
3. **Create Admin Account**: Use the API to create your first admin user
4. **Start Using**: Register users, add books, and manage the library!

## 🆘 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for project organization
- See [SETUP.md](SETUP.md) for comprehensive setup instructions

---

**Happy Coding! 🎉**

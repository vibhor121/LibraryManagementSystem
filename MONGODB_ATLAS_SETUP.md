# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for your Library Management System project.

## 🚀 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Start Free"
3. Sign up with your email or use Google/GitHub authentication
4. Verify your email address

### Step 2: Create a New Cluster

1. **Choose a Plan**:
   - Select "M0 Sandbox" (Free tier) for development
   - This gives you 512 MB storage and shared RAM
   - Perfect for learning and small projects

2. **Cloud Provider & Region**:
   - Choose AWS, Google Cloud, or Azure
   - Select a region closest to your location for better performance
   - Example: If you're in India, choose "Asia Pacific (Mumbai)"

3. **Cluster Name**:
   - Give it a descriptive name like "library-management-cluster"
   - Click "Create Cluster"

### Step 3: Set Up Database Access

1. **Navigate to Database Access** (left sidebar)
2. Click "Add New Database User"
3. **Authentication Method**: Password
4. **Username**: Create a username (e.g., `library-admin`)
5. **Password**: 
   - Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT**: Save this password securely!
6. **Database User Privileges**: 
   - Select "Read and write to any database"
   - Or create custom privileges for better security
7. Click "Add User"

### Step 4: Set Up Network Access

1. **Navigate to Network Access** (left sidebar)
2. Click "Add IP Address"

**For Development:**
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- This allows connections from any IP address
- ⚠️ **Only use this for development!**

**For Production:**
- Click "Add Current IP Address" to add your current IP
- Or manually add specific IP addresses
- This is more secure for production environments

3. Click "Confirm"

### Step 5: Get Connection String

1. **Navigate to Clusters** (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string

**Example connection string:**
```
mongodb+srv://library-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Configure Your Project

1. **Copy the environment file:**
   ```bash
   cp server/env.example server/.env
   ```

2. **Edit server/.env:**
   ```env
   NODE_ENV=development
   PORT=5000
   
   # MongoDB Atlas Connection String
   MONGODB_URI=mongodb+srv://library-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/library_management?retryWrites=true&w=majority
   
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

3. **Replace the following in your connection string:**
   - `<username>`: Your database username
   - `<password>`: Your database password
   - `cluster0.xxxxx.mongodb.net`: Your actual cluster URL
   - Add database name: `/library_management` before the query parameters

### Step 7: Test the Connection

1. **Start your server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Check the console output:**
   - You should see: "Connected to MongoDB"
   - If you see an error, check your connection string and credentials

3. **Test with a simple API call:**
   ```bash
   curl http://localhost:5000/api/health
   ```

## 🔧 Connection String Breakdown

```
mongodb+srv://username:password@cluster.mongodb.net/database?options
```

- **`mongodb+srv://`**: Protocol for MongoDB Atlas
- **`username:password`**: Your database credentials
- **`cluster.mongodb.net`**: Your cluster URL
- **`database`**: Database name (optional, will be created automatically)
- **`options`**: Connection options

## 🛡️ Security Best Practices

### 1. Environment Variables
- Never commit your `.env` file to version control
- Use environment variables for all sensitive data

### 2. Database User Permissions
- Create specific database users for different applications
- Use least privilege principle
- Regularly rotate passwords

### 3. Network Access
- For production, whitelist only necessary IP addresses
- Use VPC peering for better security
- Consider using MongoDB Atlas Private Endpoints

### 4. Connection String Security
- Use strong passwords
- Enable MongoDB Atlas authentication
- Consider using X.509 certificates for additional security

## 🚨 Troubleshooting

### Common Issues

1. **Connection Timeout**
   - Check your network access settings
   - Verify your IP address is whitelisted
   - Check firewall settings

2. **Authentication Failed**
   - Verify username and password
   - Check if the user has proper permissions
   - Ensure the user is not locked

3. **SSL/TLS Issues**
   - Make sure you're using `mongodb+srv://` protocol
   - Check if your Node.js version supports SSL
   - Verify your MongoDB driver version

4. **Database Not Found**
   - The database will be created automatically on first connection
   - Make sure the database name in the connection string is correct

### Debug Steps

1. **Check Connection String Format:**
   ```javascript
   // Correct format
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Test with MongoDB Compass:**
   - Download MongoDB Compass
   - Use your connection string to test connectivity
   - This helps isolate if the issue is with your application or Atlas

3. **Check Server Logs:**
   ```bash
   cd server
   npm run dev
   # Look for connection messages in the console
   ```

## 📊 Monitoring and Maintenance

### Atlas Dashboard
- Monitor your cluster performance
- Check connection metrics
- Set up alerts for unusual activity

### Database Maintenance
- Regular backups (automatically handled by Atlas)
- Monitor storage usage
- Review slow queries

### Cost Management
- Monitor your usage against free tier limits
- Set up billing alerts
- Consider upgrading when needed

## 🔄 Migration from Local MongoDB

If you're migrating from a local MongoDB instance:

1. **Export your data:**
   ```bash
   mongodump --db library_management --out ./backup
   ```

2. **Import to Atlas:**
   ```bash
   mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/library_management" ./backup/library_management
   ```

3. **Update your application:**
   - Change the connection string in your `.env` file
   - Test all functionality
   - Update any hardcoded localhost references

## 📚 Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://docs.mongodb.com/drivers/node/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [Atlas Community Forums](https://community.atlas.mongodb.com/)

## 🆘 Getting Help

If you encounter issues:

1. Check the [MongoDB Atlas Status Page](https://status.cloud.mongodb.com/)
2. Review the [Atlas Documentation](https://docs.atlas.mongodb.com/)
3. Post questions on [MongoDB Community Forums](https://community.mongodb.com/)
4. Contact MongoDB Support (for paid plans)

---

**Happy Coding with MongoDB Atlas! 🎉**

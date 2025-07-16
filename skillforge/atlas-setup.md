# MongoDB Atlas Setup Guide

## 📋 Quick Setup Checklist

### 1. **Database User Setup**
- Go to Database Access → Add New Database User
- Username: `skillforge-user` (or your choice)
- Password: Generate a secure password
- Database User Privileges: **Read and write to any database**

### 2. **Network Access Setup**
- Go to Network Access → Add IP Address
- For development: Add `0.0.0.0/0` (Allow access from anywhere)
- For production: Add your specific IP addresses

### 3. **Get Connection String**
Once your cluster is ready:
- Click **Connect** → **Connect your application**
- Select **Node.js** driver
- Copy the connection string
- Replace `<password>` with your database user password

### 4. **Update .env File**
Replace the MONGODB_URI in your `.env` file:
```env
MONGODB_URI=mongodb+srv://skillforge-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/skillforge?retryWrites=true&w=majority
```

### 5. **Test Connection**
```bash
npm start
```
Look for: `✅ Connected to MongoDB`

## 🔒 Security Best Practices

- **Never commit** your connection string to version control
- Use **environment variables** for credentials
- **Whitelist specific IPs** in production
- Use **strong passwords** for database users
- Enable **MongoDB Atlas monitoring**

## 🚨 Common Issues

**Connection Timeout:**
- Check Network Access whitelist
- Verify username/password in connection string

**Authentication Failed:**
- Ensure database user has correct permissions
- Check password special characters are URL-encoded

**DNS Resolution:**
- Try using IP addresses instead of hostnames
- Check firewall/antivirus blocking connections
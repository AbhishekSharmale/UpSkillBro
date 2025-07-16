# UpskillBro Authentication System

A modern, secure login and registration system for UpskillBro with MongoDB Atlas-inspired UI/UX design.

## 🚀 Features

### ✅ Frontend Features
- **Clean UI**: MongoDB Atlas-inspired design with separate Login/Signup tabs
- **Real-time Validation**: Client-side form validation with instant feedback
- **Password Strength**: Visual password strength indicator
- **Responsive Design**: Mobile-friendly authentication forms
- **User Profile**: Dropdown with user info and logout functionality

### ✅ Backend Features
- **Secure Authentication**: JWT-based session management
- **Password Security**: bcrypt hashing with salt rounds
- **Account Protection**: Rate limiting and account lockout after failed attempts
- **Input Validation**: Server-side validation with express-validator
- **MongoDB Integration**: User model with profile data

### ✅ Security Features
- **HTTPS Ready**: Helmet.js security headers
- **Rate Limiting**: Protection against brute force attacks
- **CORS Protection**: Configurable cross-origin requests
- **JWT Security**: Secure token generation and validation
- **Account Lockout**: Temporary lockout after 5 failed login attempts

## 🛠️ Tech Stack

- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas or Local)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: express-validator

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Quick Setup

1. **Run the setup script**:
   ```bash
   setup.bat
   ```

2. **Configure environment variables**:
   Edit `.env` file with your settings:
   ```env
   MONGODB_URI=mongodb://localhost:27017/skillforge
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/skillforge
   
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the server**:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. **Access the application**:
   Open http://localhost:3000 in your browser

## 🔧 Configuration

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB locally
2. Use default connection: `mongodb://localhost:27017/skillforge`

#### Option 2: MongoDB Atlas (Recommended)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

### JWT Configuration
- Change `JWT_SECRET` to a strong, unique secret key
- Adjust `JWT_EXPIRE` for token expiration (default: 7 days)

### Security Configuration
- Update `FRONTEND_URL` in `.env` for CORS
- Modify rate limiting settings in `server.js` if needed

## 🎯 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create new user account | No |
| POST | `/login` | User login | No |
| GET | `/me` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| POST | `/logout` | Logout user | Yes |
| GET | `/check` | Check authentication status | No |

### Example API Usage

#### Register User
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass123'
  })
});
```

#### Login User
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePass123',
    rememberMe: true
  })
});
```

## 🎨 UI Components

### Authentication Modal
- **Login Form**: Email, password, remember me option
- **Signup Form**: First name, last name, email, password with strength indicator
- **Tab Switching**: Seamless switching between login and signup
- **Real-time Validation**: Instant feedback on form inputs

### User Profile Dropdown
- **User Avatar**: Initials-based avatar
- **User Info**: Name and email display
- **Profile Actions**: Profile, settings, logout options

## 🔒 Security Best Practices

### Password Requirements
- Minimum 6 characters
- Must contain uppercase letter
- Must contain lowercase letter
- Must contain at least one number

### Account Protection
- 5 failed login attempts trigger 2-hour lockout
- Rate limiting: 5 auth requests per 15 minutes per IP
- JWT tokens expire after 7 days (30 days with "Remember Me")

### Data Protection
- Passwords hashed with bcrypt (12 salt rounds)
- Sensitive data excluded from API responses
- CORS protection for cross-origin requests

## 🚀 Deployment

### Production Checklist
- [ ] Change `JWT_SECRET` to a strong, unique value
- [ ] Set `NODE_ENV=production`
- [ ] Configure MongoDB Atlas connection
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Configure email service for verification

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillforge
JWT_SECRET=your-production-jwt-secret-key
FRONTEND_URL=https://www.upskillbro.com
PORT=3000
```

## 🧪 Testing

### Manual Testing
1. **Registration**: Create new account with various inputs
2. **Login**: Test login with correct/incorrect credentials
3. **Rate Limiting**: Test multiple failed login attempts
4. **Token Validation**: Test protected routes with/without tokens
5. **Profile Updates**: Test profile modification functionality

### API Testing with curl
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"SecurePass123"}'

# Login user
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

## 🔄 Integration with Existing Features

The authentication system integrates seamlessly with existing UpskillBro features:

- **User Progress**: Track learning progress per user
- **Skill Trees**: Personalized skill tracking
- **Profile Data**: Store user preferences and achievements
- **Roadmap Progress**: Save individual learning paths

## 📱 Mobile Responsiveness

- Responsive design works on all screen sizes
- Touch-friendly interface elements
- Optimized form layouts for mobile devices
- Proper viewport handling

## 🎯 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] User profile pictures
- [ ] Advanced user roles and permissions

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB service is running
   - Verify connection string in `.env`
   - Ensure network access for MongoDB Atlas

2. **JWT Token Issues**
   - Verify `JWT_SECRET` is set
   - Check token expiration settings
   - Clear browser localStorage if needed

3. **CORS Errors**
   - Update `FRONTEND_URL` in `.env`
   - Check CORS configuration in `server.js`

4. **Rate Limiting**
   - Wait for rate limit window to reset
   - Adjust limits in `server.js` if needed

## 📞 Support

For issues and questions:
1. Check this README for common solutions
2. Review server logs for error details
3. Verify environment configuration
4. Test API endpoints directly

## 📄 License

This project is part of the UpskillBro platform. All rights reserved.

---

**Built with ❤️ for the UpskillBro community**
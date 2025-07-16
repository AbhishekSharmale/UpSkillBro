const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: Date,
    lastLogin: Date,
    profile: {
        avatar: String,
        bio: String,
        skills: [String],
        currentPath: String,
        level: {
            type: Number,
            default: 1
        },
        xp: {
            type: Number,
            default: 0
        },
        completedSkills: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (this.isLocked) {
        throw new Error('Account is temporarily locked due to too many failed login attempts');
    }
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    
    if (!isMatch) {
        this.loginAttempts += 1;
        
        // Lock account after 5 failed attempts for 2 hours
        if (this.loginAttempts >= 5) {
            this.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // 2 hours
        }
        
        await this.save();
        return false;
    }
    
    // Reset login attempts on successful login
    if (this.loginAttempts > 0) {
        this.loginAttempts = 0;
        this.lockUntil = undefined;
        this.lastLogin = new Date();
        await this.save();
    }
    
    return true;
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        fullName: `${this.firstName} ${this.lastName}`,
        isEmailVerified: this.isEmailVerified,
        profile: this.profile,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
};

// Index for email lookup
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
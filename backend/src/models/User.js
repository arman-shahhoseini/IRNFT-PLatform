import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'نام کاربری الزامی است'],
    unique: true,
    trim: true,
    minlength: [3, 'نام کاربری باید حداقل 3 کاراکتر باشد'],
    maxlength: [30, 'نام کاربری نمی‌تواند بیشتر از 30 کاراکتر باشد']
  },
  email: {
    type: String,
    required: [true, 'ایمیل الزامی است'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'لطفا یک ایمیل معتبر وارد کنید']
  },
  password: {
    type: String,
    required: [true, 'رمز عبور الزامی است'],
    minlength: [6, 'رمز عبور باید حداقل 6 کاراکتر باشد'],
    select: false
  },
  profileImage: {
    type: String,
    default: 'default-profile.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'بیوگرافی نمی‌تواند بیشتر از 500 کاراکتر باشد']
  },
  socialLinks: {
    twitter: String,
    instagram: String,
    telegram: String,
    website: String
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'artist', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

export default User; 
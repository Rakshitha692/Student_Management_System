const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 *
 * Fields:
 *   - name:     String, required
 *   - email:    String, required, unique
 *   - password: String, required (stored hashed, NEVER plain text)
 *   - role:     String, enum ['user', 'admin'], default 'user'
 *   - createdAt: Date, default Date.now
 *
 * Why hash passwords?
 *   Hashing is a one-way function. If someone steals your database,
 *   they only get scrambled hashes — not the real passwords.
 *   We use bcrypt which automatically salts each password, making
 *   rainbow-table attacks virtually impossible.
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\S+@\S+\.\S+$/,
      'Please enter a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Do NOT return password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * PRE-SAVE MIDDLEWARE
 *
 * Automatically hash the password before saving to MongoDB.
 * Only hashes if the password field was actually modified.
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * INSTANCE METHOD
 *
 * Compare a candidate password with the stored hash.
 * Used during login to verify credentials.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

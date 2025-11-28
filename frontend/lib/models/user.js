import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,
  },
  address: {
    type: String,
    required: false,
  },
  password: String,
  googleId: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
  verificationExpires: Date,
  orderOtp: String,
  orderOtpExpires: Date,
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'order',
    },
  ],
});

userSchema.pre('save', async function () {
  const person = this;

  // Hash the password only if it has been modified (or is new)
  if (!person.isModified('password')) return;

  // hash password generation
  const salt = await bcrypt.genSalt(10);

  // hash password
  const hashedPassword = await bcrypt.hash(person.password, salt);

  // Override the plain password with the hashed one
  person.password = hashedPassword;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

export default mongoose.models.user || mongoose.model('user', userSchema);

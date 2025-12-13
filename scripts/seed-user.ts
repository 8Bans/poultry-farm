import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface IUser {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

async function seedUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const userEmail = 'laryd@farajasoft.com';
    const existingUser = await User.findOne({ email: userEmail });

    if (existingUser) {
      console.log('User already exists!');
      console.log('Email:', userEmail);
      return;
    }

    const hashedPassword = await bcrypt.hash('@Googlers69', 10);

    const user = await User.create({
      email: userEmail,
      password: hashedPassword,
      name: 'Laryd',
    });

    console.log('\n✓ User created successfully!');
    console.log('==========================================');
    console.log('Email:    laryd@farajasoft.com');
    console.log('Password: @Googlers69');
    console.log('==========================================');

  } catch (error) {
    console.error('Error seeding user:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedUser();

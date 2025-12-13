import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const MONGODB_URI: string = process.env.MONGODB_URI;

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

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@poultry.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', adminEmail);
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await User.create({
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin User',
    });

    console.log('\n✓ Admin user created successfully!');
    console.log('==========================================');
    console.log('Email:    admin@poultry.com');
    console.log('Password: admin123');
    console.log('==========================================');
    console.log('\nPlease change this password after first login!');

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();

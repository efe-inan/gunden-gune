import { seedAll } from './seeds';
import mongoose from 'mongoose';

const seedDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal-dev-platform');
    console.log('Connected to database');

    await seedAll();

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

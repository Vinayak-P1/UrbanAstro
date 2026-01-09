import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO = process.env.MONGO_URI;
if (!MONGO) throw new Error('MONGO_URI missing in .env');

mongoose.connect(MONGO, { })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((e) => {
    console.error('MongoDB connection error', e);
    process.exit(1);
  });

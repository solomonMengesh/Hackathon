import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    const canUseTransactions = conn.connection.host !== 'localhost' &&
                                conn.connection.host !== '127.0.0.1';

    return { connection: conn, canUseTransactions };
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

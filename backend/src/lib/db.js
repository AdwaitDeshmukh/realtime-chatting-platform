import mongoose from 'mongoose';
import { ENV } from './env.js';    
export const connectDB=async () => {
    try {
        await mongoose.connect(ENV.MONGO_URI)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log(error);
        process.exit(1);//status code 1 means fail and 0 means success
    }
}
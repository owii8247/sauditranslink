import mongoose from 'mongoose';

// const connectDB = async () => {
//     if (mongoose.connection.readyState >= 1) return;

//     await mongoose.connect(process.env.MONGODB_URI!);
// };

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI!);
      console.log("DB Connected");
    } catch (error) {
      console.error("DB Connection Error:", error);
    }
  };
  

export default connectDB;

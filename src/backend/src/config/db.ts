import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://mukundlanetteam_db_user:SMiBXvFG3ROkgB52@mukund-crm.dnnqqi8.mongodb.net/');
    // const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pdf-editor');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

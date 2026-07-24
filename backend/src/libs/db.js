import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("Connect database successful");
  } catch (error) {
    console.log("Error connect database: ", error);
    process.exit(1);
  }
};

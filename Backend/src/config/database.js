import mongoose from "mongoose";

async function connectDB() {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to Database");
    })
    .catch((err) => {
      console.log("Error Connecting to DB", err);
    });
}

export default connectDB;

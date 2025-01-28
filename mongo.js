import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
    });

const newSchema = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    userName: { type: String, required: true },
});

const User = mongoose.model("accounts", newSchema);

export default User;

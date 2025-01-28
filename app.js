import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import collection from "./mongo.js";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Update with your Vercel frontend URL
    credentials: true
}));

// Routes
app.get("/", (req, res) => {
    res.send("Welcome to The Hunter's Tavern API!");
});

app.post("/Login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await collection.findOne({ email });
        if (!user) return res.status(404).json({ message: "notexist" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: "wrong-password" });

        res.status(200).json({ message: "exist", userName: user.userName });
    } catch (e) {
        res.status(500).json({ message: "fail" });
    }
});

app.post("/Sign-up", async (req, res) => {
    const { email, userName, password } = req.body;
    try {
        const checkEmail = await collection.findOne({ email });
        const checkUserName = await collection.findOne({ userName });

        if (checkEmail) return res.json("exist");
        if (checkUserName) return res.json("username-exists");

        // Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        await collection.create({ email, userName, password: hashedPassword });

        res.json("signup-success");
    } catch (e) {
        res.status(500).json("fail");
    }
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

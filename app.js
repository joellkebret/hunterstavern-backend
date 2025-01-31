import express from "express";
import collection from "./mongo.js";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // ✅ Import bcrypt for password hashing

dotenv.config(); // Load .env variables

const app = express(); // ✅ Ensure 'app' is declared before using it

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://hunters-tavern-ekvhifdhm-joellkebrets-projects.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
}));

app.get("/", (req, res) => {
    res.send("Welcome to The Hunter's Tavern API!");
});

// ✅ Login Route (Uses 'app' after it is declared)
app.post("/Login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const check = await collection.findOne({ email });

        if (check) {
            // ✅ Compare hashed password
            const isMatch = await bcrypt.compare(password, check.password);
            if (isMatch) {
                res.status(200).json({ message: "exist", userName: check.userName });
            } else {
                res.status(401).json({ message: "wrong-password" });
            }
        } else {
            res.status(404).json({ message: "notexist" });
        }
    } catch (e) {
        res.status(500).json({ message: "fail" });
    }
});

// ✅ Signup Route (Uses 'app' after it is declared)
app.post("/Sign-up", async (req, res) => {  // ✅ Must be POST, not GET
    const { email, userName, password } = req.body;

    try {
        const checkEmail = await collection.findOne({ email });
        const checkUserName = await collection.findOne({ userName });

        if (checkEmail) {
            res.json("exist");
        } else if (checkUserName) {
            res.json("username-exists");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const data = { email, userName, password: hashedPassword };

            await collection.create(data);
            res.json("signup-success");
        }
    } catch (e) {
        res.status(500).json("fail");
    }
});

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

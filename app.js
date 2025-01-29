import express from "express";
import collection from "./mongo.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to The Hunter's Tavern API!");
});

app.post("/Login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const check = await collection.findOne({ email });

        if (check) {
            if (check.password === password) {
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

app.post("/Sign-up", async (req, res) => {
    const { email, userName, password } = req.body;

    const data = { email, userName, password };

    try {
        const checkEmail = await collection.findOne({ email });
        const checkUserName = await collection.findOne({ userName });

        if (checkEmail) {
            res.json("exist");
        } else if (checkUserName) {
            res.json("username-exists");
        } else {
            await collection.create(data);
            res.json("signup-success");
        }
    } catch (e) {
        res.status(500).json("fail");
    }
});

const PORT = 7001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

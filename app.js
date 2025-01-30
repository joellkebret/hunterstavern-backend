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

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

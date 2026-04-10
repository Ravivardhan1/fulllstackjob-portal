require("dotenv").config();
const mongoose = require("mongoose");

async function DBConnectionHandler() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.DB_STRING, {
            serverSelectionTimeoutMS: 10000, // fail fast after 10 seconds
            connectTimeoutMS: 10000,
        });
        console.log("✅ DB connected successfully");
    } catch (err) {
        console.error("❌ DB Connection Error:", err.message);
        console.error("\n👉 Fix: Go to https://cloud.mongodb.com → Network Access → Add your IP address");
        process.exit(1);
    }
}

module.exports = DBConnectionHandler;

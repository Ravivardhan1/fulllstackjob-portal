const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

async function fixPassword() {
  try {
    await mongoose.connect(process.env.DB_STRING);
    
    // Directly update the password hash in the database
    // This bypasses the model entirely so there's no chance of failure
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const result = await mongoose.connection.db.collection("users").updateOne(
      { email: "recruiterlpu@gmail.com" },
      { $set: { password: hashedPassword } }
    );
    
    if (result.matchedCount > 0) {
      console.log("SUCCESS - Password for recruiterlpu@gmail.com reset to: password123");
    } else {
      console.log("NOT FOUND - No user with email recruiterlpu@gmail.com exists");
    }
  } catch (e) {
    console.error("ERROR:", e.message);
  } finally {
    process.exit(0);
  }
}
fixPassword();

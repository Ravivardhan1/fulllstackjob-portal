const mongoose = require("mongoose");
const UserModel = require("./Model/UserModel");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

async function createGuaranteed() {
  try {
    await mongoose.connect(process.env.DB_STRING);
    // Remove if already exists so we have a fresh start
    await UserModel.deleteOne({ email: "test@recruiter.com" });
    
    // Create new
    const r = new UserModel({
      username: "Test Recruiter",
      email: "test@recruiter.com",
      password: "password123",
      role: "recruiter"
    });
    await r.save();
    console.log("CREATED");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
createGuaranteed();

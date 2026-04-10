const mongoose = require("mongoose");
const UserModel = require("./Model/UserModel");
require("dotenv").config();

async function showRecruiters() {
  try {
    // 1. Connect to the MongoDB Atlas Database
    await mongoose.connect(process.env.DB_STRING);
    
    // 2. Fetch all users who have the role "recruiter"
    const recruiters = await UserModel.find({ role: "recruiter" });
    
    console.log("\n=======================================================");
    console.log(`FOUND ${recruiters.length} RECRUITERS IN THE CLOUD DATABASE`);
    console.log("=======================================================\n");
    
    // 3. Print out their details
    recruiters.forEach((r, index) => {
      console.log(`[Recruiter ${index + 1}]`);
      console.log(`Database ID : ${r._id}`);
      console.log(`Username    : ${r.username || "N/A"}`);
      console.log(`Email       : ${r.email}`);
      console.log(`Company     : ${r.companyName || "N/A"}`);
      console.log(`Location    : ${r.location || "N/A"}`);
      console.log(`Password    : ${r.password} (Encrypted by bcrypt)`);
      console.log("-------------------------------------------------------\n");
    });

  } catch (error) {
    console.error("Failed to connect or fetch data:", error);
  } finally {
    process.exit(0);
  }
}

showRecruiters();

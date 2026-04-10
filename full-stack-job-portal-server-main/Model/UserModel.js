const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        companyName: {
            type: String,
        },
        location: {
            type: String,
        },
        gender: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "recruiter", "user"],
            default: "user",
        },
        resume: {
            type: String,
        },
    },
    { timestamps: true } // to keep track
);

// Hashing Password
UserSchema.pre("save", async function (next) {
    // Only hash the password if it's been modified (or is new)
    if (!this.isModified("password")) return next();
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err);
    }
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;

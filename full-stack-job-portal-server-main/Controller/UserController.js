const UserModel = require("../Model/UserModel");
const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWTGenerator = require("../Utils/JWTGenerator");

const setAuthCookie = (res, user) => {
    const tokenObj = {
        ID: user._id,
        role: user.role,
    };
    const TOKEN = JWTGenerator(tokenObj);
    const one_day = 1000 * 60 * 60 * 24;

    res.cookie(process.env.COOKIE_NAME, TOKEN, {
        expires: new Date(Date.now() + one_day),
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });
};

exports.getAllUser = async (req, res, next) => {
    try {
        const result = await UserModel.find({}).select("-password");
        if (result.length !== 0) {
            res.status(200).json({
                status: true,
                result,
            });
        } else {
            next(createError(200, "User list is empty"));
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const me = req.user;
        if (!me) {
            next(createError(500, "Please login first"));
        } else {
            res.status(200).json({
                status: true,
                result: me,
            });
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.logOut = async (req, res, next) => {
    try {
        res.cookie(process.env.COOKIE_NAME, "", {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            expires: new Date(0), // Set to a date in the past
            path: "/", // Ensure this matches the path set during login
        })
            .status(200)
            .json({
                status: true,
                message: "Logout done",
            });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getSingleUser = async (req, res, next) => {
    res.send("get single user");
};

exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(createError(400, "No file uploaded"));
        }
        const fileUrl = `http://localhost:3000/public/uploads/resumes/${req.file.filename}`;
        
        res.status(200).json({
            status: true,
            message: "Resume uploaded successfully",
            resumeUrl: fileUrl
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.addUser = async (req, res, next) => {
    const data = req.body;
    try {
        const isUserExists = await UserModel.findOne({ email: data.email });
        if (isUserExists) {
            next(createError(500, "Email Already exists"));
        } else {
            // Strictly enforce candidate (user) role for standard registration
            req.body.role = "user";
            
            const newUser = new UserModel(data);
            const result = await newUser.save();

            res.status(200).json({
                status: true,
                message: "Registered Successfully",
            });
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.registerRecruiter = async (req, res, next) => {
    const data = req.body;
    try {
        const isUserExists = await UserModel.findOne({ email: data.email });
        if (isUserExists) {
            return next(createError(400, "Email already registered. Please log in."));
        }
        req.body.role = "recruiter";
        const newUser = new UserModel(data);
        await newUser.save();
        res.status(200).json({
            status: true,
            message: "Recruiter account created successfully! You can now log in.",
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const isUserExists = await UserModel.findOne({ email });
        if (isUserExists) {
            const isPasswordMatched = await bcrypt.compare(
                password,
                isUserExists.password
            );
            if (isPasswordMatched) {
                setAuthCookie(res, isUserExists);
                res.status(200).json({
                    status: true,
                    message: "Login Successfully",
                    role: isUserExists.role,
                });
            } else {
                next(createError(500, "Email or Password not matched"));
            }
        } else {
            next(createError(500, "User not found!!!"));
        }
    } catch (error) {
        next(createError(500, `something wrong: ${error.message}`));
    }
};

exports.updateUser = async (req, res, next) => {
    const data = req.body;
    try {
        if (req?.user?.email !== data?.email) {
            next(createError(500, `You have no permission to update`));
        } else {
            const updateUser = await UserModel.updateOne(
                { _id: req.user._id },
                { $set: data }
            );

            if (updateUser.nModified > 0) {
                const updatedUser = await UserModel.findById(
                    req.user._id
                ).select("-password");
                res.status(200).json({
                    status: true,
                    message: "Profile Updated",
                    result: updatedUser,
                });
            } else {
                res.status(200).json({
                    status: false,
                    message: "No changes were made",
                    result: null,
                });
            }
        }
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            next(createError(400, "Invalid User ID format"));
        }

        const isUserExists = await UserModel.findOne({ _id: id });
        if (!isUserExists) {
            res.status(500).json({
                status: false,
                message: "User not found",
            });
        } else {
            const result = await UserModel.findByIdAndDelete(id);
            res.status(200).json({
                status: true,
                message: "User Deleted",
            });
        }
    } catch (error) {
        next(createError(500, `something wrong: ${error.message}`));
    }
};

exports.deleteAllUser = async (req, res, next) => {
    try {
        result = await UserModel.deleteMany({});
        res.status(201).json({
            status: true,
            message: "All userd deleted",
        });
    } catch (error) {
        next(createError(500, `something wrong: ${error.message}`));
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return next(createError(400, "Email and new password are required"));
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return next(createError(404, "No account found with this email address"));
        }

        // Update the password (pre-save hook in UserModel will auto-hash it)
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            status: true,
            message: "Password has been reset successfully! You can now log in with your new password.",
        });
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};

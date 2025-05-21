import UserModel from "../Models/UserModel.js";
import { ErrorHandler } from "../Utils/error.js";
import bcryptjs, { compareSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateToken = (id) => {
  const secret = process.env.SECRET;
  return jwt.sign({ user_id: id }, secret, { expiresIn: "4d" });
};

export const SignUp = async (req, res) => {
  const { userName, email, password, employeeType, gender, position, startDate } = req.body;
  console.log("userName", userName)
  console.log("email", email)
  console.log("password", password)
  console.log("gender", gender)
  console.log("position", position)
  console.log("startDate", startDate)

  
  if (!userName) {
    return res.status(400).json({ error: "Username is required!" });
  }

  try {
      // Hash the password before saving
   try {
  // Validate input
  if (!userName || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if user exists
  const existingUser = await UserModel.findOne({ $or: [{ userName }, { email }] });
  if (existingUser) {
    const field = existingUser.userName === userName ? "username" : "email";
    return res.status(409).json({ error: `${field} already exists` });
  }

  // Create and save user
  const newUser = new UserModel({
    userName, 
    email,
    password,
    employeeType,
    gender,
    position,
    startDate
  });

  await newUser.save();

  // Respond without password
  res.status(201).json({
     newUser // Password is automatically removed by schema's toJSON transform
  });

} catch (error) {
  console.error("Registration error:", error);
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    res.status(400).json({ error: `${field} must be unique` });
  } else {
    res.status(500).json({ error: "Internal server error" });
  }
}
  } catch (error) {
 
    console.log(error)
  }
};

   
export const SignIn = async (req, res, next) => {
  const { email, password, position } = req.body;

  try {
    if (!email || !password || !position) {
      return next(ErrorHandler(400, "All fields are required"));
    }

    const user = await UserModel.findOne({ email }).select('+password'); // Explicitly select password
    if (!user) {
      return next(ErrorHandler(401, "Invalid credentials"));
    }

    // Add this check
    if (!user.password) {
      console.error("User has no password set:", user);
      return next(ErrorHandler(401, "Authentication system error - no password set"));
    }

    const validatedPassword = await bcryptjs.compare(password, user.password);
    if (!validatedPassword) {
      return next(ErrorHandler(401, "Invalid credentials"));
    }

    if (position !== user.position) {
      return next(ErrorHandler(403, "You don't have permission to access this position"));
    }

  

    const { password: userPassword, ...rest } = user._doc;
    const token = generateToken(user._id); // Make sure you're generating a token

    return res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({
        user: rest
      });
  } catch (error) {
    console.error("SignIn error:", error);
    next(ErrorHandler(500, "Internal server error"));
  }
};

export const UpdetUser = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const profile = req.file ? `/uploads/${req.file.filename}` : undefined; // Use undefined instead of null for MongoDB updates
  const { userId } = req.params;

  try {
    // Create update object with only provided fields
    const updateData = {};

    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;
    if (profile) updateData.profile = profile;

    // Only hash and update password if it's provided
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updateData.password = bcryptjs.hashSync(password, salt);
    }

    // Use findByIdAndUpdate for ID-based updates
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error); // Use console.error for errors
    next(error);
  }
};

// GET /api/AuthRoute/pending/:adminId
export const getPendingFacultyByAdmin = async (req, res) => {
  try {
    const users = await UserModel.find({
      roles: "Faculty",
      status: "pending",
    });

    if (users.length === 0) {
      return res
        .status(200)
        .json({ message: "No pending users found", users: [] });
    }

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching pending faculty:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/auth/approve/:id
export const approveUser = async (req, res, next) => {
  try {
    const adminId = req.user?.id; // Assume populated by middleware (JWT, session, etc.)

    const updated = await UserModel.findByIdAndUpdate(
      req.params.id,
      { status: "approved", adminId },
      { new: true }
    ).select("-password");

    if (!updated) {
      return next(ErrorHandler(404, "User not found"));
    }

    res.status(200).json({ message: "User approved", user: updated });
  } catch (err) {
    next(err);
  }
};

// Example route for faculty status
export const getPendingFacuity = async (req, res) => {
  try {
    const faculty = await UserModel.findById(req.params.facultyId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json({ status: faculty.status, faculty });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getApprovedFaculty = async (req, res) => {
  try {
    const facultyList = await UserModel.find({
      roles: "Faculty",
      status: "approved",
    }).select("-password"); // exclude password

    res.status(200).json({ faculty: facultyList });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const pendingAdvisor = async (req, res, next) => {
  try {
    const advisors = await UserModel.find({
      roles: "Advisor",
      status: "pending",
    });

    res.status(200).json(advisors);
  } catch (error) {
    console.error("Error fetching pending advisors:", error);
    next(error);
  }
};

export const approveAdvisor = async (req, res, next) => {
  const { advisorId, AdminId } = req.body;
 
  console.log("AdminId", AdminId);

  try {
    if (!advisorId || !AdminId) {
      return res.status(400).json({ message: "Advisor ID and Admin ID are required" });
    }

    const advisor = await UserModel.findOneAndUpdate(
      { _id: advisorId, roles: "Advisor", status: "pending" },
      { $set: { status: "approved", approvedBy: AdminId } },
      { new: true }
    );

    if (!advisor) {
      return res.status(404).json({ message: "Advisor not found or already approved" });
    }

    res.status(200).json({ message: "Advisor approved successfully", advisor });
  } catch (error) {
    console.error("Error approving advisor:", error);
    next(error);
  }
};


export const ApprovedAdvisor = async (req, res) => {
  try {
    // Step 1: Fetch all approved advisors
    const advisors = await UserModel.find({
      roles: "Advisor", // note: capital 'A' to match your DB
      status: "approved",
    }).lean(); // plain objects

    if (!advisors.length) {
      return res.status(404).json({ message: "No approved advisors found." });
    }

    // Step 2: Fetch one approved admin (or you can change to find many if needed)
    const admin = await UserModel.findOne({
      roles: "Admin",
      status: "approved",
    }).select("_id userName email profile").lean();

    if (!admin) {
      return res.status(404).json({ message: "No approved admin found." });
    }

    // Step 3: Attach this admin as 'approvedBy' for each advisor (simulate approval)
    const advisorsWithAdmin = advisors.map(advisor => ({
      ...advisor,
      approvedBy: admin,
    }));

    // Step 4: Return
    return res.status(200).json({ advisors: advisorsWithAdmin });
  } catch (error) {
    console.error("Error fetching advisors:", error);
    return res.status(500).json({ message: "Server error while fetching advisors." });
  }
};
//pendinguser to admin
 export const getpendingusertoAdmin = async (req, res) => {
  try {
    const users = await UserModel.find({ userStatus: "pending", roles: "User" }).select("-password");
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching pending users" });
  }
};

export const approvePendingUserbyAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.userStatus === "approved") {
      return res.status(400).json({ message: "User is already approved" });
    }

    user.userStatus = "approved";  // Change status to approved
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while approving user" });
  }
};

export const getApprovedUsersbyAdmin = async (req, res) => {
  try {
    const users = await UserModel.find({ userStatus: "approved", roles: "User" }).select("-password");
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching approved users" });
  }
};

export const getUserStatusforUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error fetching user status" });
  }
};






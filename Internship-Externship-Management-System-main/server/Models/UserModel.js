import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
  userName: { 
  type: String, 
  required: true,
  unique: true, // Add this if you want unique usernames
  trim: true,
  minlength: 3,
  maxlength: 30
},
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { 
      type: String, 
      required: true,
      minlength: 6,
      select: false
    },
    employeeType: {
      type: String,
      enum: ["FullTime", "PartTime"],
      required: true
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true
    },
    position: {
      type: String,
      enum: ["CEO", "COO", "CTO", "CISO", "Director", "DeptLead", "NormalEmployee"],
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    profileImage: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    lastLogin: {
      type: Date
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { 
    timestamps: true,
    toJSON: {
      transform: function(doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("UserModel", UserSchema);
export default UserModel;
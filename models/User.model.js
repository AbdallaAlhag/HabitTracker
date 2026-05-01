import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
      minLength: 5,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,

      minLength: 5,
    },
    password: { type: String, required: true, minLength: 5 },
    // Tasks as an array of objects
    tasks: [
      {
        id: Number,
        name: String,
        color: String,
        position: Number,
        totalCount: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        currentStreak: { type: Number, default: 0 },
      },
    ],

    // Completions using a Map for date-based lookup
    // Map of strings (dates) to arrays of numbers (task IDs)
    completions: {
      type: Map,
      of: [Number],
      default: {},
    },
  },
  { timestamps: true },
);

// Hashing middleware
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

// compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
export const User = mongoose.model("User", userSchema);

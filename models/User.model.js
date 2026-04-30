import mongoose, { Schema } from "mongoose";

const userSchema = Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Tasks as an array of objects
    tasks: [
      {
        id: Number,
        name: String,
        color: String,
        position: Number,
        totalCount: Number,
        longestStreak: Number,
        currentStreak: Number,
        streak: Number,
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

export const User = mongoose.model("User", userSchema);

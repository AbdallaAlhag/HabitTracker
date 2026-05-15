import express from "express";
import cors from "cors";
import path from "path";

import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";
dotenv.config({
  path: "./.env",
});

const app = express();
app.use(express.json());
app.get("/login", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "login.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "index.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(path.resolve(), "public", "signup.html"));
});

app.use(express.static(path.join(path.resolve(), "public")));

if (process.env.NODE_ENV !== "production") {
  app.use(cors()); // production
}

app.use("/api/v1/users", userRouter);
app.use("/api/v1/habits", taskRouter);
// example route: http://localhost:4000/api/v1/users/register
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;

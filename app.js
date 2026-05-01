import express from "express";
import path from "path";

import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";

const app = express();
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);
// example route: http://localhost:4000/api/v1/users/register

export default app;

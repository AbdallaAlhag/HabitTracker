import express from "express";
import cors from "cors";
import path from "path";

import userRouter from "./routes/user.route.js";
import taskRouter from "./routes/task.route.js";

const app = express();
app.use(express.json());
app.use(express.static(path.join(path.resolve(), "public")));
// All cors during dev
app.use(cors());

// production
// const corsOptions = {
//   origin: "http://localhost:3000",
// };
// app.use(cors(corsOptions));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/habits", taskRouter);
// example route: http://localhost:4000/api/v1/users/register

export default app;

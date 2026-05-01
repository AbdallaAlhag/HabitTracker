import { Router } from "express";

import {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
  updateCompletion,
  getCompletion,
} from "../controllers/task.controller.js";
const router = Router();

// don't even use those two, maybe remove them
router.route("/createTask").post(createTask);
router.route("/deleteTask").delete(deleteTask);

// useful
router.route("/getTask").get(getAllTask);
router.route("/updateTask").patch(updateTask);
router.route("/updateCompletion").patch(updateCompletion);
router.route("/getCompletion").get(getCompletion);
//
export default router;

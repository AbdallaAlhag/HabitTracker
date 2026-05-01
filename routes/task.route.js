import { Router } from "express";

import {
  createTask,
  getAllTask,
  updateTask,
  deleteTask,
  updateCompletion,
} from "../controllers/task.controller.js";
const router = Router();

router.route("/createTask").post(createTask);
router.route("/getTask").get(getAllTask);
router.route("/updateTask").patch(updateTask);
router.route("/deleteTask").delete(deleteTask);
router.route("/updateCompletion").patch(updateCompletion);
//
export default router;

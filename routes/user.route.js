import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router();

// auth
router.route("/register").post(registerUser);
// router.route('/login').post(loginUser);
// router.route('/logout').post(logoutuser);

export default router;

import express from "express";
import controller from "./auth.controller.js";
import { authMiddleware } from "../../core/auth.js";

const router = express.Router();

router.post("/send-otp", controller.sendOtp);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", authMiddleware, controller.logout);

export default router;
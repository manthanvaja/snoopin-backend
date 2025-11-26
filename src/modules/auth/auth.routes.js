import express from "express";
import controller from "./auth.controller.js";

const router = express.Router();

router.post("/send-otp", controller.sendOtp);
router.post("/login", controller.login);
router.post("/refresh", controller.refresh);

export default router;

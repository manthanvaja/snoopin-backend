import express from "express";
import controller from "./vendors.controller.js";

const router = express.Router();

router.post("/inquiry", controller.createInquiry);

export default router;

import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import vendorRoutes from "./modules/vendors/vendors.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);

export default app;

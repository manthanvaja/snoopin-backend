import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';
import dotenv from 'dotenv';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

dotenv.config();
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return errorResponse(res, "Phone and OTP are required.", 400);
        }

        // Validate phone format (10 digits)
        if (!/^\d{10}$/.test(phone)) {
            return errorResponse(res, "Phone number must be 10 digits.", 400);
        }

        const STATIC_OTP = '123456';

        if (otp !== STATIC_OTP) {
            return errorResponse(res, "Invalid OTP. Please try again.", 401);
        }

        // Check if user exists
        const userQuery = 'SELECT * FROM "Users" WHERE "Phone" = $1';
        const result = await pool.query(userQuery, [phone]);

        let user;
        if (result.rows.length === 0) {
            const insertQuery = `
                INSERT INTO "Users" ("Phone", "CreatedDatetime")
                VALUES ($1, NOW())
                RETURNING *;
            `;
            const insertResult = await pool.query(insertQuery, [phone]);
            user = insertResult.rows[0];
            console.log(`🆕 New user created: ${phone}`);
        } else {
            user = result.rows[0];
            console.log(`👤 Existing user logged in: ${phone}`);
        }

        const token = jwt.sign(
            { id: user.Id, phone: user.Phone },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Updated response structure
        return successResponse(res, {
            token,
            userId: user.Id,
            phone: user.Phone
        }, "Login successful");

    } catch (err) {
        console.error("Login error:", err);
        return errorResponse(res, "Internal server error", 500);
    }
});

router.post('/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return errorResponse(res, "Phone number is required.", 400);
        }

        if (!/^\d{10}$/.test(phone)) {
            return errorResponse(res, "Phone number must be 10 digits.", 400);
        }

        // TODO: Implement actual OTP sending logic (SMS gateway)
        // For now, just return success
        console.log(`📱 OTP sent to: ${phone}`);

        return successResponse(res, null, "OTP sent successfully");

    } catch (err) {
        console.error("Send OTP error:", err);
        return errorResponse(res, "Internal server error", 500);
    }
});

export default router;
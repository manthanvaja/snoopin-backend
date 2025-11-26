import authService from "./auth.service.js";
import { success, error } from "../../core/response.js";
import { isPhone, isOtp } from "../../utils/validator.js";

class AuthController {
    async sendOtp(req, res) {
        try {
            const { phone } = req.body;
            if (!isPhone(phone)) return error(res, "Invalid phone", 400);

            await authService.sendOtp(phone);
            success(res, null, "OTP sent");
        } catch (e) {
            error(res, e.message);
        }
    }

    async login(req, res) {
        try {
            const { phone, otp } = req.body;
            if (!isPhone(phone)) return error(res, "Invalid phone", 400);
            if (!isOtp(otp)) return error(res, "Invalid OTP", 400);

            const data = await authService.login(phone, otp);
            success(res, data, "Login successful");
        } catch (e) {
            error(res, e.message, e.message === "Invalid OTP" ? 401 : 500);
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return error(res, "Token required", 400);

            const data = await authService.refresh(refreshToken);
            success(res, data, "Token refreshed");
        } catch (e) {
            error(res, "Invalid refresh token", 401);
        }
    }
}

export default new AuthController();

import { supabase } from "../../config/supabase.js";
import { makeToken, makeRefresh, verifyRefresh } from "../../core/auth.js";

const OTP = "123456";

class AuthService {
    async findOrCreate(phone) {
        const { data: user, error: selectError } = await supabase
            .from('Users')
            .select("Id, Phone")
            .eq("Phone", phone)
            .single();

        if (selectError && selectError.code !== "PGRST116") {
            console.error("Select error:", selectError);
            throw new Error("Database select error");
        }

        if (user) return user;

        const { data: newUser, error: insertError } = await supabase
            .from('Users')
            .insert([{ Phone: phone }])
            .select()
            .single();

        if (insertError) {
            console.error("Insert error:", insertError);
            throw new Error("Database insert error");
        }

        return newUser;
    }

    async sendOtp(phone) {
        console.log(`OTP sent to ${phone}: ${OTP}`);
        return true;
    }

    async login(phone, otp) {
        if (otp !== OTP) throw new Error("Invalid OTP");

        const user = await this.findOrCreate(phone);

        if (!user) {
            throw new Error("Failed to authenticate user");
        }

        return {
            user,
            accessToken: makeToken({ id: user.Id, phone }),
            refreshToken: makeRefresh({ id: user.Id, phone }),
        };
    }

    async refresh(token) {
        const decoded = verifyRefresh(token);

        const { data: user, error } = await supabase
            .from('Users')
            .select("Id, Phone")
            .eq("Id", decoded.id)
            .single();

        if (error || !user) {
            throw new Error("User not found");
        }

        return { accessToken: makeToken({ id: user.Id, phone: user.Phone }) };
    }
}

export default new AuthService();
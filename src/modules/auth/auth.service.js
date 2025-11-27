import { supabase } from "../../config/supabase.js";
import { makeToken, makeRefresh, verifyRefresh } from "../../core/auth.js";

const OTP = "123456";

class AuthService {
    async findOrCreate(phone) {
        const { data: user, error: selectError } = await supabase
            .from('Users')
            .select("Id, Phone, Lat, Long")
            .eq("Phone", phone)
            .single();

        if (selectError && selectError.code !== "PGRST116") {
            throw new Error("Database select error");
        }

        if (user) return user;

        const { data: newUser, error: insertError } = await supabase
            .from('Users')
            .insert([{ Phone: phone }])
            .select()
            .single();

        if (insertError) throw new Error("Database insert error");

        return newUser;
    }

    async updateLocation(userId, lat, long) {
        if (!lat || !long) return;

        await supabase
            .from("Users")
            .update({ Lat: lat, Long: long })
            .eq("Id", userId);
    }

    async sendOtp(phone) {
        console.log(`OTP sent to ${phone}: ${OTP}`);
        return true;
    }

    async login(phone, otp, lat, long) {
        if (otp !== OTP) throw new Error("Invalid OTP");

        const user = await this.findOrCreate(phone);

        // update location
        await this.updateLocation(user.Id, lat, long);

        return {
            user,
            accessToken: makeToken({ id: user.Id, phone }),
            refreshToken: makeRefresh({ id: user.Id, phone })
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

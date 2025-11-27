import { supabase } from "../../config/supabase.js";

class VendorsService {
    async createInquiry(body) {
        const {
            personName,
            businessName,
            contactNumber,
            email,
            vendorType,
            briefMessage,
            latitude,
            longitude
        } = body;

        if (!personName || !contactNumber)
            throw new Error("Name & Contact Number required");

        const { data, error } = await supabase
            .from("VendorInquiry")
            .insert([{
                PersonName: personName,
                BusinessName: businessName || null,
                ContactNumber: contactNumber,
                Email: email || null,
                VendorType: vendorType || null,
                BriefMessage: briefMessage,
                Latitude: latitude,
                Longitude: longitude
            }])
            .select()
            .single();

        if (error) throw new Error("Failed to save inquiry");

        return data;
    }
}

export default new VendorsService();

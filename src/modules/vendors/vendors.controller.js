import vendorService from "./vendors.service.js";
import { success, error } from "../../core/response.js";

class VendorsController {
    async createInquiry(req, res) {
        try {
            const data = await vendorService.createInquiry(req.body);
            success(res, data, "Vendor inquiry saved");
        } catch (e) {
            error(res, e.message, 400);
        }
    }
}

export default new VendorsController();

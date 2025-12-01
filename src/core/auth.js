import jwt from "jsonwebtoken";

export const makeToken = (payload, time = "7d") =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: time });

export const makeRefresh = (payload) =>
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "90d" });

export const verifyToken = (token) =>
    jwt.verify(token, process.env.JWT_SECRET);

export const verifyRefresh = (token) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ result: false, message: "No token provided" });

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ result: false, message: "Invalid or expired token" });
    }
};
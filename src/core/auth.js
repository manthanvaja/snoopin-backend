import jwt from "jsonwebtoken";

export const makeToken = (payload, time = "15m") =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: time });

export const makeRefresh = (payload) =>
    jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

export const verifyRefresh = (token) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET);

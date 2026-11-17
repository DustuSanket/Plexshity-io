import jwt from "jsonwebtoken";
import redis from "../config/cache.js";

export async function identifyUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized Access",
      success: false,
      err: "No token provided",
    });
  }

  const isTokenBlacklisted = await redis.get(token);

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized Access",
      success: false,
      err: "Invalid provided",
    });
  }
}

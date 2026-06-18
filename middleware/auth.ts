import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authorization header missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = { userId: decoded.userId };

    next();
  } catch {
    return res.status(403).json({
      error: "Invalid or expired token",
    });
  }
};

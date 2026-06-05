import { JWTPayload } from "@/types/jwt.types";
import jwt, { JwtPayload } from "jsonwebtoken";
// generateAccessToken()

// generateRefreshToken()

// verifyAccessToken()

// verifyRefreshToken()

export const generateAccessToken = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
};

export const generateRefreshToken = (payload: JWTPayload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JwtPayload | string | false => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
  } catch {
    return false;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | string | false => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    return false;
  }
};


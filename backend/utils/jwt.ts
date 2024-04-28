import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
require("dotenv").config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | undefined;
  secure?: boolean;
}

export const accessExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
export const refreshExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

// Options For Cookies
export const accessTokenOption: ITokenOptions = {
  expires: new Date(Date.now() + accessExpire * 60 * 60 * 100),
  maxAge: accessExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};
export const refreshTokenOption: ITokenOptions = {
  expires: new Date(Date.now() + refreshExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  try {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    // set Redis Session id
    redis.set(user._id, JSON.stringify(user) as any);

    if (process.env.NODE_ENV === "production") {
      accessTokenOption.secure = true;
      // refreshTokenOption.secure = true;
    }
    res.cookie("access_token", accessToken, accessTokenOption);
    res.cookie("refresh_token", refreshToken, refreshTokenOption);

    res.status(statusCode).json({
      success: true,
      user,
      accessToken,
    });
  } catch (error) {
    console.error("Error sending token:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

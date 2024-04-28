import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";

// create users
export const getUserbyID = async (id: string, res: Response) => {
    const userJson = await redis.get(id);
    if (userJson) {
        const user = JSON.parse(userJson);
        // console.log("User is:-------",user)
        res.status(200).json({
            success: true,
            user,
        });
    }
};

// get all users -- for Admin

export const getAlluser = async (res: Response) => {
    const users = await userModel.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        users,
    });
};

// update user role
export const updateUserService = async (
    res: Response,
    id: string,
    role: string
) => {
    const users = await userModel.findByIdAndUpdate(id, { role }, { new: true });
    res.status(201).json({
        success: true,
        users,
    });
};

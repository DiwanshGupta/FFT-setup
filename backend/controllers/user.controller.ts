import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { Errorhandler } from "../utils/Errorhandler";
import userModel, { IUser } from "../models/user.model";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import { sendEmail } from "../utils/sendEmail";
import { accessTokenOption, refreshTokenOption, sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import {
  getAlluser,
  getUserbyID,
  updateUserService,
} from "../services/user.service";
import cloudinary from "cloudinary";
require("dotenv").config();

interface IRegisterBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const RegisterUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new Errorhandler("Email already exist", 400));
      }
      const user: IRegisterBody = {
        name,
        email,
        password,
      };

      const activeToken = createActiveToken(user);
      const activeCodeToken = activeToken.activeCode;
      const data = { user: { name: user.name }, activeCodeToken };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activationMail.ejs"),
        data
      );
      try {
        await sendEmail({
          email: user.email,
          subject: "Activate Your Account",
          template: "activationMail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email :${user.email} to activate your account`,
          activeCodeToken: activeToken.token,
        });
      } catch (error: any) {
        return next(new Errorhandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new Errorhandler(error.message, 400));
    }
  }
);
interface IsActiveToken {
  token: string;
  activeCode: string;
}

export const createActiveToken = (user: any): IsActiveToken => {
  const activeCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    {
      user,
      activeCode,
    },
    process.env.ACTIVE_KEY as Secret,
    {
      expiresIn: "5m",
    }
  );

  return { token, activeCode };
};

// activate User
interface IsactiveUser {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } = req.body as IsactiveUser;
      const decodedToken: { user: IUser; activeCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVE_KEY as Secret
      ) as { user: IUser; activeCode: string };

      if (decodedToken.activeCode !== activation_code) {
        return next(new Errorhandler("Invalid activation code", 400));
      }

      const { name, email, password } = decodedToken.user;
      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new Errorhandler("Email already exists", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({ success: true });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 400));
    }
  }
);

// Login user
interface IloginUser {
  email: string;
  password: string;
}

export const LoginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as IloginUser;

      if (!email || !password) {
        return next(new Errorhandler("Please enter Email and Password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new Errorhandler("Email not found", 400));
      }

      const isPasswordValid = await user.comparePswd(password);

      if (!isPasswordValid) {
        return next(new Errorhandler("Wrong Password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 400));
    }
  }
);

// logout user
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";
      console.log("this is", userId);
      redis.del(userId);
      res.status(200).json({
        success: true,
        message: "Logout successfully",
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 400));
    }
  }
);

// update previous token after login

export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        token,
        process.env.REFRESH_TOKEN as string
      ) as JwtPayload;
      const message = "could not refresh token";
      if (!decoded) {
        return next(new Errorhandler(message, 400));
      }
      const session = await redis.get(decoded.id as string);
      if (!session) {
        return next(
          new Errorhandler("Please login to acces this resources!", 400)
        );
      }
      const user = JSON.parse(session);
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        }
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        }
      );
      req.user = user;
      res.cookie("access_token", accessToken, accessTokenOption);
      res.cookie("refresh_token", refreshToken, refreshTokenOption);
      console.log(user._id);
      await redis.set(user._id, JSON.stringify(user), "EX", 604800); //7days
      res.status(200).json({
        status: "Success",
        accessToken,
        refreshToken,
        user,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 400));
    }
  }
);

// social account auth
interface Isocial {
  email: string;
  name: string;
  avatar: string;
}
export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as Isocial;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, avatar, name });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new Errorhandler(error.message, 400));
    }
  }
);

// get user Info
export const getUserinfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user?._id;
      // console.log("user info", user);
      getUserbyID(user, res);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 400));
    }
  }
);

// update user info

interface Iupdateuser {
  name?: string;
  email?: string;
}
export const updateUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email } = req.body as Iupdateuser;
      const userId = req.user?._id;
      if (!userId) {
        return next(new Errorhandler("User ID not provided", 400));
      }
      const user = await userModel.findById(userId);
      if (!user) {
        return next(new Errorhandler("User not found", 404));
      }

      if (email) {
        const isEmailExist = await userModel.findOne({ email });
        if (isEmailExist) {
          return next(new Errorhandler("Email already exists", 400));
        }
        user.email = email;
      }

      if (name) {
        user.name = name;
      }

      await user?.save();

      await redis.set(userId, JSON.stringify(user));

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// update user password

interface Iupdatepswd {
  opswd: string;
  npswd: string;
}

export const updatepswd = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { opswd, npswd } = req.body as Iupdatepswd;

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new Errorhandler("Invalid pswd", 400));
      }

      const ispswdMatch = await user?.comparePswd(opswd);
      if (!ispswdMatch) {
        return next(new Errorhandler("Password id incorrect", 400));
      }
      user.password = npswd;
      await user.save();
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// update user avatar

interface Iavatar {
  avatar: string;
}

export const updateUserAvatar = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as Iavatar;
      console.log("Received avatar data:", avatar);
      const userId = req.user?._id;
      const user = await userModel.findById(userId);
      if (avatar && user) {
        // if user have old avatar
        if (user?.avatar?.public_id) {
          // destroy the old avatar
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
          // update the new avatar
          const mycloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "profile",
            width: 150,
          });
          user.avatar = {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
          };
        } else {
          const mycloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "profile",
            width: 150,
          });
          user.avatar = {
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
          };
        }
      }
      await user?.save();
      await redis.set(userId, JSON.stringify(user));
      console.log(user);
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// get all users

export const alluserAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAlluser(res);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

// update user role by admin

export const updateUserAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, role } = req.body;
      updateUserService(res, id, role);
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await userModel.findById(id);
      if (!user) {
        return next(new Errorhandler("User not found", 400));
      }
      await user.deleteOne({ id });
      await redis.del(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfuly",
      });
    } catch (error: any) {
      return next(new Errorhandler(error.message, 500));
    }
  }
);

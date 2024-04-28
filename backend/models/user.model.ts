import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
require("dotenv").config();
const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerfied: boolean;
  courses: Array<{ courseID: string }>;
  comparePswd: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const UserSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter your name"],
    },
    email: {
      type: String,
      required: [true, "Please Enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter your valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      // required: [true, "Please enter your Password "],
      minlength: [6, "Passwoord Must be at least 6 Characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseID: String,
      },
    ],
  },
  { timestamps: true }
);

// Hash Password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// sign acess token

UserSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// sign after refresh token

UserSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};

// Compare Passowrds
UserSchema.methods.comparePswd = async function (
  enterpswd: string
): Promise<Boolean> {
  return await bcrypt.compare(enterpswd, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", UserSchema);
export default userModel;

import express from "express";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { UserModel } from "../db/models/user";
import { utilsFunctions } from "../utils/utilsFunctions";
import jwt from "jsonwebtoken";

class UsersController {
  login = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = req.body;
      const validUser = await UserModel.findOne({ email });
      if (!validUser) {
        throw new Error(`User not found`);
      }

      const validPassword = bcryptjs.compareSync(password, validUser.password);

      if (!validPassword) {
        throw new Error(`wrong password`);
      }

      const token = jwt.sign(
        { id: validUser._id },
        process.env.JWT_SECRET ?? ""
      );
      return res
        .cookie(process.env.JWT_COOKIE_NAME ?? "", token, { httpOnly: true })
        .status(200)
        .json({
          _id: validUser._id,
          username: validUser.username,
          email: validUser.email,
          profilePic: validUser.profilePic,
        });
    } catch (err: any) {
      return res.status(401).send(err.message);
    }
  };
  signup = async (req: express.Request, res: express.Response) => {
    try {
      const { username, email, password, confirmPassword, gender } = req.body;
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new Error(
          `The user ${user.email} is already exist in the system`
        );
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords don`t match");
      }

      const hashedPassword = bcryptjs.hashSync(password, 10);

      const maleProfileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}&top=dreads01,dreads02,frizzle,shaggy,shortCurly,shortFlat,shortWaved&eyes=default&facialHair=beardLight,beardMajestic&eyebrows=default&mouth=default&facialHairColor=${utilsFunctions.getRandomHexColor()}&hairColor=${utilsFunctions.getRandomHexColor()}&clothesColor=3c4f5c,262e33,25557c,929598,b1e2ff&accessories=eyepatch,prescription02,round,wayfarers,sunglasses&accessoriesProbability=20`;
      const womanProfileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}&top=bigHair,bob,bun,curly,curvy,dreads,straight01&eyes=default&facialHair=beardLight,beardMajestic&eyebrows=default&mouth=default&facialHairColor=${utilsFunctions.getRandomHexColor()}&hairColor=${utilsFunctions.getRandomHexColor()}&facialHairProbability=0&clothesColor=ff488e,ffafb9,ffffb1,ff5c5c,5199e4&accessories=kurt,prescription01,sunglasses&accessoriesProbability=20`;

      const newUser = new UserModel({
        username,
        email,
        gender,
        password: hashedPassword,
        profilePic: gender === "male" ? maleProfileImage : womanProfileImage,
      });
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET ?? "");
      await newUser.save();
      return res
        .cookie(process.env.JWT_COOKIE_NAME ?? "", token, { httpOnly: true })
        .status(200)
        .json({
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profilePic: newUser.profilePic,
        });
    } catch (err: any) {
      return res.status(401).send(err.message);
    }
  };
  logout = async (req: express.Request, res: express.Response) => {
    try {
      res.clearCookie(process.env.JWT_COOKIE_NAME ?? "");
      res.status(200).send("user has been logout successfully!");
    } catch (err: any) {
      return res.status(401).send(err.message);
    }
  };

  getUserForSideBar = async (req: express.Request, res: express.Response) => {
    try {
      const loggedInUser = req.user?.id;
      const allUserExceptLoggedIn = await UserModel.find({
        _id: { $ne: loggedInUser },
      }).select("-password");
      return res.status(200).json(allUserExceptLoggedIn);
    } catch (err: any) {
      return res.status(401).send(err.message);
    }
  };
}

export default new UsersController();

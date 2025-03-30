import { Request, Response } from "express";
import User from "../models/UserSchema.mjs";
import { converDbToDto } from "./helpers.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
  } else {
    //Skulle kunna göra en till egen funktion - login
    const foundUser = await User.findOne({ email: email }).lean(); //Gör om till objekt
    if (foundUser) {
      const success = await bcrypt.compare(password, foundUser.password);
      if (success) {
        const token = jwt.sign(foundUser, "my-secret");

        const currentDate = new Date();
        currentDate.setHours(currentDate.getHours() + 1);

        res.cookie("login", token, {
          expires: currentDate,
          httpOnly: false,
        });

        res.status(200).json({
          message: "Logged in on user",
          User: converDbToDto(foundUser),
        });
      } else {
        res.status(400).json({ message: "Password incorrect" });
      }
    } else {
      res.status(400).json({ message: "User not found" });
    }
  }
};

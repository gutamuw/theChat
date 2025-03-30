import { Response, Request } from "express";
import User from "../models/UserSchema.mjs";
import { converDbToDto } from "./helpers.mjs";
import bcrypt from "bcryptjs";

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
  } else {
    //skulle kunna göra till egen funktion createUser
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    res.status(200).json({
      message: "User registered successfully",
      User: converDbToDto(newUser),
    });
  }
};

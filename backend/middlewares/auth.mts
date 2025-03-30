import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserDto } from "../models/UserDto.mjs";
import User from "../models/UserSchema.mjs";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const loginCookie = req.cookies["login"];

  if (!loginCookie) {
    res.status(401).end();
  } else {
    const result = jwt.decode(loginCookie);
    if (result) {
      const user: UserDto = result as UserDto;
      const userFromDb = await User.findOne({ email: user.email });

      if (userFromDb) {
        next();
      } else {
        res.status(403).send("User not found in database");
      }
    } else {
      res.status(401).end();
    }
  }
};

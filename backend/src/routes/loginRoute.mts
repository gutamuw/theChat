import { Router } from "express";
import { loginUser } from "../controllers/loginController.mjs";

export const loginRouter = Router();
loginRouter.post("/", loginUser);

import { Router } from "express";
import { registerUser } from "../controllers/registerUser.mjs";

export const registerRouter = Router();

registerRouter.post("/", registerUser);

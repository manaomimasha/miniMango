import { Router } from "express"


export const userRouter = Router();
import {
  renderProfile,
  renderLogIn,
  logIn,
  renderRegister,
  register,
  logout,
} from "../controllers/userController.js"

userRouter.get("/user/profile", renderProfile);

userRouter.get("/user/login", renderLogIn);
userRouter.post("/user/login", logIn);

userRouter.get("/user/register", renderRegister);
userRouter.post("/user/register", register);

userRouter.get("/user/logout", logout);


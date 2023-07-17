import { Router } from "express";
import {
  getUserInvitation,
  sendInviation,
} from "../controllers/userController";

const userRouter = Router();

userRouter.post("/invitation", sendInviation);
userRouter.get("/:id/invitation", getUserInvitation);

export default userRouter;

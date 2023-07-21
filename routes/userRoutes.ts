import { Router } from "express";
import {
  getUserInvitations,
  sendInviation,
  acceptInvitation,
  rejectInvitation,
  blockUser,
  unBlockUser,
  userProfile,
  invitationStream,
} from "../controllers/userController";
import { authenticate } from "../middlewares/authenticate";

const userRouter = Router();

userRouter.get("/:id/profile", authenticate, userProfile);
userRouter.post("/invitation", authenticate, sendInviation);
userRouter.get("/:id/invitations", authenticate, getUserInvitations);
userRouter.get("/accept/:id/invitation", authenticate, acceptInvitation);
userRouter.get("/reject/:id/invitation", authenticate, rejectInvitation);
userRouter.get("/block/:id/invitation", authenticate, blockUser);
userRouter.get("/unblock/:id/invitation", authenticate, unBlockUser);
userRouter.get("/invitations-stream", invitationStream);

export default userRouter;
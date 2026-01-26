import { Router } from "express";
import {
  signupController,
  loginController,
  refreshController,
  logoutController,
  logoutAllController,
  forgotPasswordController,
  resetPasswordController,
  verifyEmailController,
} from "../controller/auth-controller.js";
import { authGuard } from "../../middleware/middleware.js";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.post("/refresh", refreshController);
router.post("/logout", authGuard, logoutController);
router.post("/logout-all", authGuard, logoutAllController);
router.get("/protected", authGuard, (req, res) => {
  res.send("This is protected route");
});

router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/verify-email", verifyEmailController);

export default router;

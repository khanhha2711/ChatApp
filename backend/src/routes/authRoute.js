import express from "express";
import {
  refreshToken,
  signIn,
  signInGoogle,
  signOut,
  signUp,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", signOut);
router.post("/refresh", refreshToken);
router.post("/google", signInGoogle);

export default router;

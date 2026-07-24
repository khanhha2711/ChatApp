import express from "express";
import { fetchMe } from "../controllers/userController.js";
import { searchUserByEmail } from "../controllers/friendController.js";

const router = express.Router();

router.get("/me", fetchMe);
router.get("/search", searchUserByEmail);

export default router;
